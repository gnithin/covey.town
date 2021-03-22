import { mock, mockReset } from 'jest-mock-extended';
import { Socket } from 'socket.io';
import { nanoid } from 'nanoid';
import Player from '../types/Player';
import CoveyTownController from './CoveyTownController';
import CoveyTownsStore from './CoveyTownsStore';
import * as TestUtils from '../TestUtils';
import { townSubscriptionHandler } from '../requestHandlers/CoveyTownRequestHandlers';
import PlayerSession from '../types/PlayerSession';
import { emit } from 'process';


describe('Chat Messages', () => {
    let testingRoom: CoveyTownController; 
    const mockSockets = [mock<Socket>(),mock<Socket>(),mock<Socket>(), mock<Socket>()]; 
    let players: Player[] = new Array(4);
    let playerSessions: PlayerSession[] = new Array(4);
    function sendMessage(message: string, broadcastRadius : number) {
        mockSockets[0].on.mock.calls.forEach(call => {
            if (call[0] === 'sendChatMessage')
                call[1]({
                    message,
                    broadcastRadius
                });
        });
    }

    beforeEach(async () => {
        const roomName = `chatMessage Feature tests ${nanoid()}`;        
        // Create a new room to use for each test
        testingRoom = CoveyTownsStore.getInstance().createTown(roomName, true);
        // Reset the log on the mock socket
        mockSockets.forEach(mockReset);
        // Create players for the rooms.
        for(let i = 0;i<4;i++){
            players[i] = new Player(`${nanoid()}`);
            playerSessions[i] = await testingRoom.addPlayer(players[i]);
            TestUtils.setSessionTokenAndRoomID(testingRoom.coveyTownID, playerSessions[i].sessionToken, mockSockets[i]);      
            townSubscriptionHandler(mockSockets[i]);
        }
      });
    it('should broadcast message to the nearby players.',async () =>  {     
        //Send a message through the socket.
        sendMessage('Hello World', 80);        
        //Check that the  listeners get the chat message
        expect(mockSockets[1].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
        expect(mockSockets[2].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());               
        expect(mockSockets[3].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());               
    });
    it('should not broadcast message to players beyond the radius.',async () =>  {     
        //Update the location of player 4
        players[3].updateLocation({
            x: 60,
            y: 60,
            rotation: 'front',
            moving: false
        })
        //Send a message through the socket.                
        mockSockets[0].on.mock.calls.forEach(call => {
                if (call[0] === 'sendChatMessage')call[1]({ message: 'Test Message2',
                broadcastRadius: 80}); 
              });        
        //Check that the  listeners get the chat message
        expect(mockSockets[1].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());
        expect(mockSockets[2].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());               
        expect(mockSockets[3].emit).not.toHaveBeenCalledWith('receiveChatMessage', expect.anything());               
    });
    it('message should also be broadcast to the sender.',async () =>  {             
        //Send a message through the socket.                
        mockSockets[0].on.mock.calls.forEach(call => {
                if (call[0] === 'sendChatMessage')call[1]({ message: 'Test Message3',
                broadcastRadius: 80}); 
              });        
        //Check that the  listeners get the chat message
        expect(mockSockets[0].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());           
    });
    it('Disconnected users should not receive the messages.',async () =>  {  

        sendMessage('Test Message4',80);
        //Check that the  listeners get the chat message
        expect(mockSockets[1].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());     
        mockSockets[1].on.mock.calls.forEach(call => {
            if (call[0] === 'disconnect')call[1](); 
          });                 
        sendMessage('Test Message5',80);  
        expect(mockSockets[2].emit).toHaveBeenCalledWith('receiveChatMessage', expect.anything());     
        expect(mockSockets[1].emit).not.toBeCalledWith();     
    });
    it('message should be broadcast with the correct text.',async () =>  {             
        //Send a message through the socket.                
        sendMessage('Welcome all',80);       
        //Check that the  listeners get the chat message
        expect(mockSockets[1].emit).toHaveBeenLastCalledWith('receiveChatMessage',expect.objectContaining({message: 'Welcome all'}));           
    });
    // Test with the negative radius. What behavior are we expecting.

    it('message should be broadcast with the correct sender id.',async () =>  {             
        //Send a message through the socket.                
        sendMessage('Welcome all',80);      
        //Check that the  listeners get the chat message
        expect(mockSockets[1].emit).toHaveBeenLastCalledWith('receiveChatMessage',expect.objectContaining({sender: players[0] }));           
    });
    it('Only the sender should get the receiver player details of the broadcast message.',async () =>  {             
        //Send a message through the socket.                
        
        mockSockets[1].on.mock.calls.forEach(call => {
            if (call[0] === 'disconnect')call[1](); 
          }); 
        sendMessage('Houston, do you copy?',80);                   
        //Check that the  listeners get the chat message
        expect(mockSockets[2].emit).toHaveBeenLastCalledWith('receiveChatMessage', expect.objectContaining({receivingPlayers : undefined}));           
        expect(mockSockets[0].emit).toHaveBeenLastCalledWith('receiveChatMessage', expect.objectContaining({receivingPlayers : expect.arrayContaining([players[2],players[3]])}));           
    });



});




