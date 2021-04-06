import { customAlphabet, nanoid } from 'nanoid';
import { Socket } from 'socket.io';
import { UserLocation } from '../CoveyTypes';
import CoveyTownListener from '../types/CoveyTownListener';
import Player from '../types/Player';
import PlayerSession from '../types/PlayerSession';
import TwilioVideo from './TwilioVideo';
import IVideoClient from './IVideoClient';
import { IncomingChatMessage, OutgoingChatMessage } from '../types/payloads';

const friendlyNanoID = customAlphabet('1234567890ABCDEF', 8);

/**
 * An adapter between CoveyTownController's event interface (CoveyTownListener)
 * and the low-level network communication protocol
 *
 * @param socket the Socket object that we will use to communicate with the player
 */
function townSocketAdapter(socket: Socket): CoveyTownListener {
  return {
    onPlayerMoved(movedPlayer: Player) {
      socket.emit('playerMoved', movedPlayer);
    },
    onPlayerDisconnected(removedPlayer: Player) {
      socket.emit('playerDisconnect', removedPlayer);
    },
    onPlayerJoined(newPlayer: Player) {
      socket.emit('newPlayer', newPlayer);
    },
    onTownDestroyed() {
      socket.emit('townClosing');
      socket.disconnect(true);
    },
    onReceiveChatMessage(message: OutgoingChatMessage) {
      socket.emit('receiveChatMessage', message);
    },
  };
}

/**
 * The CoveyTownController implements the logic for each town: managing the various events that
 * can occur (e.g. joining a town, moving, leaving a town)
 */
export default class CoveyTownController {
  get capacity(): number {
    return this._capacity;
  }

  set isPubliclyListed(value: boolean) {
    this._isPubliclyListed = value;
  }

  get isPubliclyListed(): boolean {
    return this._isPubliclyListed;
  }

  get townUpdatePassword(): string {
    return this._townUpdatePassword;
  }

  get players(): Player[] {
    return this._sessions.map(s => s.player);
  }

  get occupancy(): number {
    return this._sessions.length;
  }

  get friendlyName(): string {
    return this._friendlyName;
  }

  set friendlyName(value: string) {
    this._friendlyName = value;
  }

  get coveyTownID(): string {
    return this._coveyTownID;
  }

  /** The list of valid sessions for this town * */
  private _sessions: PlayerSession[] = [];

  /** The videoClient that this CoveyTown will use to provision video resources * */
  private _videoClient: IVideoClient = TwilioVideo.getInstance();

  /** A map of the PlayerSessions to the corresponding CoveyTownListeners * */
  private _listeners: Map<PlayerSession, CoveyTownListener> = new Map();

  // each player maintains a list of blocked players
  private _blockedPlayerSessions: Map<PlayerSession, PlayerSession[]> = new Map();

  // private blockedUsers: Map<string, string[]> = new Map();   // playerId(string)

  private readonly _coveyTownID: string;

  private _friendlyName: string;

  private readonly _townUpdatePassword: string;

  private _isPubliclyListed: boolean;

  private _capacity: number;

  constructor(friendlyName: string, isPubliclyListed: boolean) {
    this._coveyTownID = (process.env.DEMO_TOWN_ID === friendlyName ? friendlyName : friendlyNanoID());
    this._capacity = 50;
    this._townUpdatePassword = nanoid(24);
    this._isPubliclyListed = isPubliclyListed;
    this._friendlyName = friendlyName;
  }

  /**
   * Adds a player to this Covey Town, provisioning the necessary credentials for the
   * player, and returning them
   *
   * @param newPlayer The new player to add to the town
   */
  async addPlayer(newPlayer: Player): Promise<PlayerSession> {
    const session = new PlayerSession(newPlayer);
    this._sessions.push(session);
    // Create a video token for this user to join this town
    session.videoToken = await this._videoClient.getTokenForTown(this._coveyTownID, newPlayer.id);
    // Notify other players that this player has joined
    this._listeners.forEach((listener) => listener.onPlayerJoined(newPlayer));
    return session;
  }

  /**
   * Configures the socket to emit and react to events.
   * @param sessionToken The session token of the player connected via the socket
   * @param socket The player's socket to configure
   */
  connect(sessionToken: string, socket: Socket): void {
    const session = this._sessions.find((p) => p.sessionToken === sessionToken);
    if (!session) {
      // No valid session exists for this token, hence this client's connection should be terminated
      socket.disconnect(true);
    } else {
      this._listeners.set(session, townSocketAdapter(socket));
      socket.on('disconnect', () => {
        this.onDisconnect(session);
      });
      socket.on('playerMovement', (movementData: UserLocation) => {
        this.onPlayerMovement(session, movementData);
      });
      socket.on('sendChatMessage', (message: IncomingChatMessage) => {
        this.onSendChatMessage(session, message);
      });
      socket.on('blockPlayerInChat', (playerID: string) => {
        this.onBlockPlayer(session, playerID);
      });
      socket.on('unblockPlayerInChat', (playerID: string) => {
        this.onUnblockPlayer(session, playerID);
      });
    }
  }

  private onSendChatMessage(session: PlayerSession, incomingMessage: IncomingChatMessage): void {
    const sender = session.player;
    const isInChatRadius = (p: Player) => {
      const dx = p.location.x - sender.location.x;
      const dy = p.location.y - sender.location.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      return d <= Math.max(0, incomingMessage.broadcastRadius);
    };
    const nearbyPlayerSessions = this._sessions.filter(s => isInChatRadius(s.player));

    const notBlocked = (s: PlayerSession) => {
      const length = this._blockedPlayerSessions.get(session)?.length;
      for(let i=0; i<(length as number); i++) {
        if (this._blockedPlayerSessions.get(session)?.includes(s)) {
          return false;
        }
      }
      return true;
    };
    const nearbyUnblockedPlayerSessions = nearbyPlayerSessions.filter(s => notBlocked(s));

    const receivingPlayers = nearbyUnblockedPlayerSessions.map(s => s.player).filter(p => p.id !== sender.id);
    const timestamp = new Date().getTime();
    nearbyUnblockedPlayerSessions.forEach(nearbyUnblockedPlayerSession => {
      this._listeners.get(nearbyUnblockedPlayerSession)?.onReceiveChatMessage({
        sender,
        timestamp,
        message: incomingMessage.message,
        receivingPlayers: nearbyUnblockedPlayerSession.player.id === sender.id ? receivingPlayers : undefined,
      });
    });
  }


  private onBlockPlayer(session: PlayerSession, playerID: string): void {
    // create the key, value pair if it is not present in the map
    if (!this._blockedPlayerSessions.has(session)) {
      this._blockedPlayerSessions.set(session, []);
    }
    // add the blocked player to the block list of 'session'
    const blockPlayerSession = this._sessions.find((s) => s.player.id === playerID);
    this._blockedPlayerSessions.get(session)?.push(blockPlayerSession as PlayerSession);
  }


  private onUnblockPlayer(session: PlayerSession, playerID: string): void {
    const blockedPlayerSession = this._sessions.findIndex((s) => s.player.id === playerID);
    this._blockedPlayerSessions.get(session)?.splice(blockedPlayerSession, 1);
  }


  /**
   * Updates the location of a player within the town
   * @param session PlayerSession to update location for
   * @param location New location for this player
   */
  private onPlayerMovement(session: PlayerSession, location: UserLocation): void {
    session.player.updateLocation(location);
    this._listeners.forEach((listener) => listener.onPlayerMoved(session.player));
  }

  /**
   * Disconnect the player from the town
   * @param session The session associated with the player to disconnect
   */
  private onDisconnect(session: PlayerSession) {
    this._sessions = this._sessions.filter((s) => s.sessionToken !== session.sessionToken);
    this._listeners.delete(session);
    this._listeners.forEach((listener) => listener.onPlayerDisconnected(session.player));
  }

  /**
   * Notify all listeners that the town is destroyed.
   */
  destroyTown(): void {
    this._listeners.forEach((listener) => listener.onTownDestroyed());
  }
}
