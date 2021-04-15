import {nanoid} from 'nanoid';
import {mock, mockReset} from 'jest-mock-extended';
import {Socket} from 'socket.io';
import TwilioVideo from './TwilioVideo';
import Player from '../types/Player';
import CoveyTownController from './CoveyTownController';
import {UserLocation} from '../CoveyTypes';
import PlayerSession from '../types/PlayerSession';
import {townSubscriptionHandler} from '../requestHandlers/CoveyTownRequestHandlers';
import CoveyTownsStore from './CoveyTownsStore';
import * as TestUtils from '../client/TestUtils';

jest.mock('./TwilioVideo');

const mockGetTokenForTown = jest.fn();
// eslint-disable-next-line
// @ts-ignore it's a mock
TwilioVideo.getInstance = () => ({
  getTokenForTown: mockGetTokenForTown,
});
const mockSockets = [mock<Socket>(), mock<Socket>(), mock<Socket>(), mock<Socket>()];  
const players: Player[] = new Array(4);
const playerSessions: PlayerSession[] = new Array(4);
let testingTown : CoveyTownController;

function generateTestLocation(): UserLocation {
  return {
    rotation: 'back',
    moving: Math.random() < 0.5,
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  };
}
beforeEach(async () => {    
  const roomName = `chatMessage Feature tests ${nanoid()}`;        
  // Create a new room to use for each test
  testingTown = CoveyTownsStore.getInstance().createTown(roomName, true);
  // Reset the log on the mock socket
  mockSockets.forEach(mockReset);
  // Create players for the rooms.
  for (let i = 0; i < 4; i += 1){
    players[i] = new Player(`${nanoid()}`);
    playerSessions[i] = await testingTown.addPlayer(players[i]); // eslint-disable-line no-await-in-loop
    TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, playerSessions[i].sessionToken, mockSockets[i]);      
    townSubscriptionHandler(mockSockets[i]);
  }
  mockGetTokenForTown.mockClear();
});

describe('CoveyTownController', () => {  
  function movePlayer(playerIndex: number, newUserLocation : UserLocation) {
    mockSockets[playerIndex].on.mock.calls.forEach(call => {
      if (call[0] === 'playerMovement')
        call[1](newUserLocation);
    });
  }
  function disconnectPlayer(playerIndex: number) {
    mockSockets[playerIndex].on.mock.calls.forEach(call => {
      if (call[0] === 'disconnect')
        call[1]();
    });
  }
  it('constructor should set the friendlyName property', () => { // Included in handout
    const townName = `FriendlyNameTest-${nanoid()}`;
    const townController = new CoveyTownController(townName, false);
    expect(townController.friendlyName)
      .toBe(townName);
  });
  describe('addPlayer', () => { // Included in handout
    it('should use the coveyTownID and player ID properties when requesting a video token',
      async () => {
        const townName = `FriendlyNameTest-${nanoid()}`;
        const newtownController = new CoveyTownController(townName, false);
        const newPlayerSession = await newtownController.addPlayer(new Player(nanoid()));
        expect(mockGetTokenForTown).toBeCalledTimes(1);
        expect(mockGetTokenForTown).toBeCalledWith(newtownController.coveyTownID, newPlayerSession.player.id);
      });
  });
  describe('town listeners and events', () => {    
    it('should notify added listeners of player movement when updatePlayerLocation is called', async () => {      
      const newLocation = generateTestLocation();         
      movePlayer(0, newLocation);
      mockSockets.forEach(socket => expect(socket.emit).toBeCalledWith('playerMoved', expect.anything()))  ;
      
    });
    it('should notify added listeners of player disconnections when destroySession is called', async () => {
      disconnectPlayer(0);        
      mockSockets.forEach((socket, i) => i !== 0 && expect(socket.emit).toBeCalledWith('playerDisconnect', players[0]))  ;
    });
    it('should notify added listeners of new players when addPlayer is called', async () => {     
      const player = new Player('test player1');
      await testingTown.addPlayer(player);        
      mockSockets.forEach(socket => expect(socket.emit).toBeCalledWith('newPlayer', player))  ;
    });
    it('should notify added listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);      
      testingTown.destroyTown();
      mockSockets.forEach(socket => expect(socket.emit).toBeCalledWith('townClosing'));
    });
    it('should not notify removed listeners of player movement when updatePlayerLocation is called', async () => {
      disconnectPlayer(0); 
      const newLocation = generateTestLocation();         
      movePlayer(1, newLocation);
      expect(mockSockets[0].emit).not.toBeCalledWith('playerMoved', expect.anything());
    });
    it('should not notify removed listeners of player disconnections when destroySession is called', async () => {
      disconnectPlayer(0);        
      disconnectPlayer(1);  
      expect(mockSockets[0].emit).not.toBeCalledWith('playerDisconnect', expect.anything());
    });
    it('should not notify removed listeners of new players when addPlayer is called', async () => {
      disconnectPlayer(0);   
      const player = new Player('test player');      
      await testingTown.addPlayer(player);      
      expect(mockSockets[0].emit).not.toBeCalledWith('newPlayer', player);
    });

    it('should not notify removed listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
      disconnectPlayer(0);        
      testingTown.destroyTown();  
      expect(mockSockets[0].emit).not.toBeCalledWith('townClosing', expect.anything());

    });
  });
  describe('townSubscriptionHandler', () => {
    const mockSocket = mock<Socket>();    
    let player: Player;
    let session: PlayerSession;
    beforeEach(async () => {
      mockReset(mockSocket);
      player = new Player('test player');
      session = await testingTown.addPlayer(player);
    });
    it('should reject connections with invalid town IDs by calling disconnect', async () => {
      TestUtils.setSessionTokenAndTownID(nanoid(), session.sessionToken, mockSocket);
      townSubscriptionHandler(mockSocket);
      expect(mockSocket.disconnect).toBeCalledWith(true);
    });
    it('should reject connections with invalid session tokens by calling disconnect', async () => {
      TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, nanoid(), mockSocket);
      townSubscriptionHandler(mockSocket);
      expect(mockSocket.disconnect).toBeCalledWith(true);
    });
    describe('with a valid session token', () => {
      it('should add a town listener, which should emit "newPlayer" to the socket when a player joins', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        townSubscriptionHandler(mockSocket);
        await testingTown.addPlayer(player);
        expect(mockSocket.emit).toBeCalledWith('newPlayer', player);
      });
      it('should add a town listener, which should emit "townClosing" to the socket and disconnect it when disconnectAllPlayers is called', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        townSubscriptionHandler(mockSocket);
        testingTown.destroyTown();
        expect(mockSocket.emit).toBeCalledWith('townClosing');
        expect(mockSocket.disconnect).toBeCalledWith(true);
      });
      describe('when a socket disconnect event is fired', () => {
        it('should remove the town listener for that socket, and stop sending events to it', async () => {
          TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
          townSubscriptionHandler(mockSocket);

          // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
          const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
          if (disconnectHandler && disconnectHandler[1]) {
            disconnectHandler[1]();
            const newPlayer = new Player('should not be notified');
            await testingTown.addPlayer(newPlayer);
            expect(mockSocket.emit).not.toHaveBeenCalledWith('newPlayer', newPlayer);
          } else {
            fail('No disconnect handler registered');
          }
        });
        it('should destroy the session corresponding to that socket', async () => {
          TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
          townSubscriptionHandler(mockSocket);

          // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
          const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
          if (disconnectHandler && disconnectHandler[1]) {
            disconnectHandler[1]();
            mockReset(mockSocket);
            TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
            townSubscriptionHandler(mockSocket);
            expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
          } else {
            fail('No disconnect handler registered');
          }

        });
      });
      it('should forward playerMovement events from the socket to subscribed listeners', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        townSubscriptionHandler(mockSocket);
        // find the 'playerMovement' event handler for the socket, which should have been registered after the socket was connected
        const playerMovementHandler = mockSocket.on.mock.calls.find(call => call[0] === 'playerMovement');
        if (playerMovementHandler && playerMovementHandler[1]) {
          const newLocation = generateTestLocation();
          player.location = newLocation;
          playerMovementHandler[1](newLocation);
          mockSockets.forEach(socket => expect(socket.emit).toBeCalledWith('playerMoved', expect.anything()))  ;
        } else {
          fail('No playerMovement handler registered');
        }
      });
    });
  });
});
describe('Chat Messages', () => {
  function sendMessage(playerIndex: number, message: string, broadcastRadius : number) {
    mockSockets[playerIndex].on.mock.calls.forEach(call => {
      if (call[0] === 'sendChatMessage')
        call[1]({
          message,
          broadcastRadius,
        });
    });
  }

  it('should broadcast message to the nearby players.', async () =>  {     
    // Send a message through the socket.
    sendMessage(0, 'Hello World', 80);        
    // Check that the  listeners get the chat message
    expect(mockSockets[1].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[2].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());               
    expect(mockSockets[3].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());               
  });
  it('should not broadcast message to players beyond the radius.', async () =>  {     
    sendMessage(0, 'Test Message', 80)   ;
    expect(mockSockets[3].emit).toBeCalledWith('receiveChatMessage', expect.anything());               
    // Update the location of player 4
    players[3].updateLocation({
      x: 60,
      y: 60,
      rotation: 'front',
      moving: false,
    });
    // Send a message through the socket.                 
    sendMessage(0, 'Test Message Again', 80)   ;
    // Check that the  listeners get the chat message
    expect(mockSockets[1].emit).toBeCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[2].emit).toBeCalledWith('receiveChatMessage', expect.anything());               
    expect(mockSockets[3].emit).not.toBeCalledWith('receiveChatMessage');
  });
  it('Negative Broadcast radius should be considered as 0', async () =>  {     
    players[1].updateLocation(generateTestLocation());
    players[2].updateLocation(generateTestLocation());
    players[3].updateLocation(generateTestLocation());
    // Send a message through the socket.                 
    sendMessage(0, 'Test Message Again', -80)   ;
    // Check that the  listeners get the chat message
    expect(mockSockets[0].emit).toBeCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[1].emit).not.toBeCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[2].emit).not.toBeCalledWith('receiveChatMessage', expect.anything());               
    expect(mockSockets[3].emit).not.toBeCalledWith('receiveChatMessage', expect.anything());
  });
  it('message should also be broadcast to the sender.', async () =>  {             
    // Send a message through the socket.                
    sendMessage(0, 'Test Message3', 80);
    // Check that the  listeners get the chat message
    expect(mockSockets[0].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());           
  });
  it('Disconnected users should not receive the messages.', async () =>  {
    sendMessage(0, 'Test Message4', 80);
    // Check that the  listeners get the chat message
    expect(mockSockets[1].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());     
    mockSockets[1].on.mock.calls.forEach(call => {
      if (call[0] === 'disconnect')call[1](); 
    });                 
    sendMessage(0, 'Test Message5', 80);  
    expect(mockSockets[2].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());     
    expect(mockSockets[1].emit).not.toBeCalledWith();     
  });
  it('message should be broadcast with the correct text.', async () =>  {             
    // Send a message through the socket.                
    sendMessage(0, 'Welcome all', 80);       
    // Check that the  listeners get the chat message
    expect(mockSockets[1].emit).toHaveBeenLastCalledWith('receiveChatMessage', expect.objectContaining({message: 'Welcome all'}));           
  });  
  it('message should be broadcast with the correct sender id.', async () =>  {             
    // Send a message through the socket.                
    sendMessage(0, 'Welcome all', 80);      
    // Check that the  listeners get the chat message
    expect(mockSockets[1].emit).toHaveBeenLastCalledWith('receiveChatMessage', expect.objectContaining({sender: players[0] }));           
  });
  it('Only the sender should get the receiver player details of the broadcast message.', async () =>  {             
    sendMessage(0, 'Houston, do you copy?', 80);                   
    // Check that the  listeners get the chat message
    expect(mockSockets[2].emit).toHaveBeenLastCalledWith('receiveChatMessage', expect.objectContaining({receivingPlayers : undefined}));           
    expect(mockSockets[0].emit).toHaveBeenLastCalledWith('receiveChatMessage', expect.objectContaining({receivingPlayers : expect.arrayContaining([players[1], players[2], players[3]])}));           
  });
  it('When multiple messages are sent, they should be received in the correct order.', async () =>  {             
    sendMessage(0, 'Message 1', 80);                   
    sendMessage(0, 'Message 2', 80);
    sendMessage(0, 'Message 3', 80);
    // Check that the  listeners get the chat message  
    const numberOfMessagesReceived = mockSockets[2].emit.mock.calls.length;              
    expect(mockSockets[2].emit.mock.calls[numberOfMessagesReceived-1]).toEqual(expect.arrayContaining(['receiveChatMessage', expect.objectContaining({message: 'Message 3'})]));
    expect(mockSockets[2].emit.mock.calls[numberOfMessagesReceived-2]).toEqual(expect.arrayContaining(['receiveChatMessage', expect.objectContaining({message: 'Message 2'})]));
    expect(mockSockets[2].emit.mock.calls[numberOfMessagesReceived-3]).toEqual(expect.arrayContaining(['receiveChatMessage', expect.objectContaining({message: 'Message 1'})]));                
  });
  it('When multiple players send messages, they should be received in the correct order.', async () =>  {             
    sendMessage(0, 'Message 1', 80);                   
    sendMessage(1, 'Message 2', 80);
    sendMessage(3, 'Message 3', 80);
    // Check that the  listeners get the chat message  
    const numberOfMessagesReceived = mockSockets[2].emit.mock.calls.length;              
    expect(mockSockets[2].emit.mock.calls[numberOfMessagesReceived-1]).toEqual(expect.arrayContaining(['receiveChatMessage', expect.objectContaining({message: 'Message 3', sender: players[3]})]));
    expect(mockSockets[2].emit.mock.calls[numberOfMessagesReceived-2]).toEqual(expect.arrayContaining(['receiveChatMessage', expect.objectContaining({message: 'Message 2', sender: players[1]})]));
    expect(mockSockets[2].emit.mock.calls[numberOfMessagesReceived-3]).toEqual(expect.arrayContaining(['receiveChatMessage', expect.objectContaining({message: 'Message 1', sender: players[0]})]));                
  });

});


describe('block-user chat message', () => {
  function sendMessage(playerIndex: number, message: string, broadcastRadius : number) {
    mockSockets[playerIndex].on.mock.calls.forEach(call => {
      if (call[0] === 'sendChatMessage')
        call[1]({
          message,
          broadcastRadius,
        });
    });
  }
  
  function blockPlayer(playerIndex: number, playerID: string) {
    mockSockets[playerIndex].on.mock.calls.forEach(call => {
      if (call[0] === 'blockPlayerInChat')
        call[1](playerID);
    });
  }

  function unblockPlayer(playerIndex: number, playerID: string) {
    mockSockets[playerIndex].on.mock.calls.forEach(call => {
      if (call[0] === 'unblockPlayerInChat')
        call[1](playerID);
    });
  }

  it('should not receive messages from nearby blocked players', async () => {
    // Player 0 blocks player 1
    blockPlayer(0, players[1].id);
    // Player 1 sends a message via the socket
    sendMessage(1, 'Hello World', 80);
    // Check player 0 does not recieve the message
    expect(mockSockets[0].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    // Check other players receive the message
    expect(mockSockets[1].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[2].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything()); 
    expect(mockSockets[3].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
  });

  it('should receive messages from player again when he/she is unblocked', async () => {
    // Player 0 blocks player 1
    blockPlayer(0, players[1].id);
    // Player 1 sends a message via the socket
    sendMessage(1, 'Hello World', 80);
    // Check player 0 does not recieve the message
    expect(mockSockets[0].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    // Check other players receive the message
    expect(mockSockets[1].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[2].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything()); 
    expect(mockSockets[3].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    // player 0 unblocks player 1
    unblockPlayer(0, players[1].id);
    // Player 1 sends a message via the socket
    sendMessage(1, 'Hello World Again', 80);
    // check if all players receive the message
    mockSockets.forEach(socket => expect(socket.emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything()));
  });

  it('should broadcast message to the nearby unblocked players and not to the blocked players', async () => {
    // Player 0 blocks player 1 and player 2
    blockPlayer(0, players[1].id);
    blockPlayer(0, players[2].id);
    // Player 0 sends a message via the socket
    sendMessage(0, 'Hello World', 80);
    // Check player 1 and player2 does not recieve the message
    expect(mockSockets[1].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[2].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything()); 
    // Check other players receive the message
    expect(mockSockets[0].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[3].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
  });

  it('should broadcast message to the player again when he/she is unblocked', async () => {
    // Player 0 blocks player 1
    blockPlayer(0, players[1].id);
    // Player 0 sends a message via the socket
    sendMessage(0, 'Hello World', 80);
    // Check player 1 does not recieve the message
    expect(mockSockets[1].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    // Check other players receive the message
    expect(mockSockets[0].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[2].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything()); 
    expect(mockSockets[3].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    // player 0 unblocks player 1
    unblockPlayer(0, players[1].id);
    // Player 0 sends a message via the socket
    sendMessage(0, 'Hello World Again', 80);
    // check if all players including player 1 receive the message
    mockSockets.forEach(socket => expect(socket.emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything()));
  });

  it('player should receive message as long as sender is not the player who blocked him/her', async () => {
    // player 0 and player 1 blocks player 3
    blockPlayer(0, players[3].id);
    blockPlayer(1, players[3].id);
    
    sendMessage(0, 'weather is hot today', 80);
    sendMessage(1, 'weather is cold today', 80);
    sendMessage(2, 'weather is warm today', 80);
    expect(mockSockets[3].emit).toHaveBeenCalledTimes(1);
    expect(mockSockets[3].emit).toHaveBeenLastCalledWith('receiveChatMessage', expect.objectContaining({message: 'weather is warm today'}));
  });

  it('should not broadcast message to anyone when all players are blocked other than sender himself', async () => {
    // player 0 blocks everyone
    for (let i=1; i<mockSockets.length; i+=1) {
      blockPlayer(0, players[i].id);
    }
    // Player 0 sends a message via the socket
    sendMessage(0, 'nobody should receive this', 80);
    // check if sender himself received the message
    expect(mockSockets[0].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    // Check other players does not receive the message
    expect(mockSockets[1].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything()); 
    expect(mockSockets[2].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything()); 
    expect(mockSockets[3].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything());
  });

  it('message should be broadcast with the correct text, blocking a user should not change this', async () =>  {     
    blockPlayer(2, players[3].id);        
    sendMessage(2, 'Welcome all', 80);       
    expect(mockSockets[0].emit).toHaveBeenLastCalledWith('receiveChatMessage', expect.objectContaining({message: 'Welcome all'}));           
  });  
  
  it('message should be broadcast with the correct sender id, blocking a user should not change this', async () =>  { 
    blockPlayer(3, players[0].id);             
    sendMessage(3, 'Welcome all', 80);      
    expect(mockSockets[1].emit).toHaveBeenLastCalledWith('receiveChatMessage', expect.objectContaining({sender: players[3] }));           
  });
  
  it('sender getting the receiver player details should not include the blocked player.', async () =>  { 
    blockPlayer(0, players[1].id);               
    sendMessage(0, 'I lost my wallet', 80);                   
             
    expect(mockSockets[0].emit).toHaveBeenLastCalledWith('receiveChatMessage', 
      expect.objectContaining({receivingPlayers : expect.arrayContaining([players[2], players[3]])}));           
  });

  it('unblocking a player who is not blocked', async () =>  { 
    // unblocking a player multiple time is the same as unblocking the player once
    unblockPlayer(0, players[1].id);
    sendMessage(0, 'We should play with legos at camp', 80); 
    expect(mockSockets[1].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything()); 
  
  });

  it('blocking someone who is already blocked', async () =>  { 
    // blocking a player multiple time is the same as blocking the player once
    blockPlayer(0, players[1].id); 
    blockPlayer(0, players[1].id); 
    blockPlayer(0, players[1].id);  
    sendMessage(0, 'go get some coffee', 80); 
    expect(mockSockets[1].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[0].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything()); 
    expect(mockSockets[2].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
    expect(mockSockets[3].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
  });

  
});