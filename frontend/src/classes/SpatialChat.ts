import Player, { ServerPlayer } from "./Player";


export interface ServerChatEntry {
    sender: ServerPlayer;
    message: string;
    timestamp: number;
    receivingPlayers: ServerPlayer[] | undefined;
}

export class ChatEntry {
    sender: Player;

    message: string;

    timestamp: number;

    receivingPlayers?: Player[];

    constructor(sender: Player, message: string, timestamp: number, receivingPlayers: Player[] | undefined) {
        this.sender = sender;
        this.message = message;
        this.timestamp = timestamp;
        this.receivingPlayers = receivingPlayers;
    }

    generateKey(): string {
        return `${this.sender}-${this.timestamp}-${this.message}`;
    }

    static fromServerChat(serverChatEntry: ServerChatEntry): ChatEntry {
        const serverReceivingPlayers = serverChatEntry.receivingPlayers;
        let receivingPlayers;
        if (serverReceivingPlayers && serverReceivingPlayers.length > 0) {
            receivingPlayers = serverReceivingPlayers.map((serverPlayer) =>
                Player.fromServerPlayer(serverPlayer)
            )
        }

        return new ChatEntry(
            Player.fromServerPlayer(serverChatEntry.sender),
            serverChatEntry.message,
            serverChatEntry.timestamp,
            receivingPlayers
        );
    }
}