# Spatial Chat Design

This document describes the design decisions that were made for individual user-stories.

## Chatting with another user

### Frontend

The following diagram represents how the spatial-chat feature interacts with the backend.

<kbd>
	<img src="docs/frontend-conversations-diag.png" alt="Frontend architecture" height="600px"/>
</kbd>

Spatial Chat stores all of the data in a Redux store. We used redux primarily due to the fact that there are multiple components that might need to interact with data. Having a centralized store, makes it easier for different components to fetch them and not depend on their ancestor-components passing them through component-props.

As shown in the above diagram, whenever the frontend receives a `receiveChatMessage` event, it is added to the store. The ConversationsList component listens to changes to the store and automatically renders the new data whenever the store is updated.

When a user types in a message and sends it, the frontend emits a `sendChatMessage` event to the backend.

Before we began coding up the frontend, this was the mock-up we based it off of. The labels indicate the names of the components.

<kbd>
	<img src="docs/frontend-chat-mockup.png" alt="Frontend Mock"  height="750px"/>
</kbd>

### Backend

The backend is responsible for broadcasting a message to the right players when a someone sends a message. It does not store any of the chat messages.

When the backend receives a `sendChatMessage` event from a player via the socket server, it first identifies the players who are inside the message broadcast radius which is specified as part of the message. It then emits a `receiveChatMessage` event using each of the receiving players' sockets to broadcast the message to them.

The backend emits a `receiveChatMessage` event to the sender too. A list of recieving players is included in the payload for this event. This list is used by the frontend to display the receivers for every message sent by a player.

There are no public listeners and no specific methods to add listeners anymore. The listeners are registered automically when a player connects and listens to updates. We made this design change because we wanted to associate every player session with a listener. So we changed the data structure from a list of player sessions and a list of listeners, to a map that keeps track of player sessions and their corresponding listeners.

## Blocking another user

### Frontend

On the frontend, a toggle switch is included as part of every received message, and this can be used to block/unblock the player. When this switch is toggled on, a `blockPlayerInChat` event is emitted via the socket server, and when it is toggled off a `unblockPlayerInChat` event is emitted.

The frontend maintains a list of blocked players in the redux store. This is used to maintain consistency in the state of the toggle switches across all the received messages. For eg. if player A receives 5 messages from player B, and player A blocks player B using the toggle switch in one of the messages, then the toggle switches in the other 4 messages from B are also switched on.

### Backend

To set up blocking another user in backend, we added a map that kept track of a chat block list for each PlayerSession. We also added two more listening events, `blockPlayerInChat` and `unblockPlayerInChat`. The main idea was that whenever a user blocks/unblocks another user, the two respective events are being listened and will add the blocked player to the chat block list or remove the blocked player from the chat block list depending on the action. Finally, while broadcasting messages, we filter the list of receiving players based on the chat block lists. This ensures that a player's messages are not sent to a player they blocked and that a player does not receive messages from someone they blocked.

## Rich text editor

This was a frontend-only feature. The redux store contains a property called `settingChatEditorType` which holds the current editor type. Whenever the user changes the setting, this value will change, as indicated in the below diagram.

<kbd>
	<img src="docs/rich-text-editor-arch.png" alt="Rich text editor Component interaction"/>
</kbd>

The final redux store properties that we used for all the features looks like this -

```js
ChatReducerState = {
  chats: [],
  settingChatEditorType: ChatEditorType.DEFAULT_EDITOR,
  settingChatBroadcastRadius: constants.DEFAULT_BROADCAST_RADIUS,
  blockedPlayerIds: [],
};
```

For the rich text editor UI, we tried out several libraries like [Draft.js](https://github.com/facebook/draft-js) and [react-rte](https://github.com/sstur/react-rte). We finally settled on [Quill](https://github.com/quilljs/quill) primarily because the documentation was very good, and the APIs were simple enough for our use-case. The other libraries had issues ranging from extremely steep learning curve, bad documentation, non-modifiable UI and not being able to render the output from the rich-text component.
