/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-await-in-loop,@typescript-eslint/no-loop-func,no-restricted-syntax */
import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ConversationsListView from './index'
import reducer from '../../../redux/reducers';
import { ChatEntry } from '../../../classes/SpatialChat';
import Player from '../../../classes/Player';

// A custom renderer that'll wrap the given element within a redux-provider
const render = (
    ui: ReactElement,
    {
        initialState = {},
        ...renderOptions
    } = {}
) => {
    const store = createStore(reducer, initialState);
    // eslint-disable-next-line react/prop-types
    const Wrapper: React.FC = ({ children }) => <Provider store={store}>{children}</Provider>
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

const mockUseCoveyAppState = jest.fn(() => (Promise.resolve()));
jest.mock('../../../hooks/useCoveyAppState', () => ({
    __esModule: true, // this property makes it work
    default: () => (mockUseCoveyAppState)
}));

// Helper method to create initial state with chat-entries
const createInitialStateWithChatEntries = (chatEntries: ChatEntry[]) => ({
    chat: {
        chats: chatEntries,
        blockedPlayerIds: [],
    }
})

// Helper method to create a chat-entry
const createChatEntryForMessage = (message: string) => new ChatEntry(
    new Player(`dummy-id-${new Date().getTime()}`, "dummy-name", {
        x: 1,
        y: 1,
        rotation: 'left',
        moving: true,
    }),
    message,
    (new Date().getTime()),
    undefined,
)

describe('Rendering the conversations list view', () => {
    it('Test if the conversations list wrapper is loaded on the screen', () => {
        const renderedElement = render(
            <ConversationsListView />,
        );
        renderedElement.getByTestId("conversations-wrapper");
    })

    it('Test for presence of chat entries in the conversations list view', () => {
        const messages = [
            "Hey how are you",
            "I'm depressed. How about you?",
            "Same here. Jinx!",
            "How's the weather?",
            "Horrible!"
        ];

        const renderedElement = render(
            <ConversationsListView />,
            {
                initialState: createInitialStateWithChatEntries(
                    messages.map(createChatEntryForMessage)
                )
            }
        );
        for (const msg of messages) {
            renderedElement.getByText(msg);
        }
    })
});