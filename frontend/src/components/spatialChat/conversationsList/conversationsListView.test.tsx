/* eslint-disable no-await-in-loop,@typescript-eslint/no-loop-func,no-restricted-syntax */
import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { render as rtlRender } from '@testing-library/react'
import ConversationsListView from './index'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../../../redux/reducers';
import { ChatEntry } from '../../../classes/SpatialChat';
import Player from '../../../classes/Player';

const render = (
    ui: ReactElement,
    {
        initialState = {},
        ...renderOptions
    } = {}
) => {
    const store = createStore(reducer, initialState);
    const Wrapper: React.FC = ({ children }) => {
        return <Provider store={store}>{children}</Provider>
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

const createInitialStateWithChatEntries = (chatEntries: ChatEntry[]) => {
    return {
        chat: {
            chats: chatEntries,
            current_message: "Sample Message"
        }
    }
}

const createChatEntryForMessage = (message: string) => {
    return new ChatEntry(
        new Player(`dummy-id-${new Date().getTime()}`, "dummy-name", {
            x: 1,
            y: 1,
            rotation: 'left',
            moving: true,
        }),
        message,
        (new Date().getTime()),
        undefined,
    );
}

describe('Rendering the conversations list view', () => {
    it('Test for presence of chat entries in the conversations list view', () => {
        const messages = [
            "Hey how are you",
            "I'm depressed. How about you?",
            "Same here. Jinx!",
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

    it('Test for presence of chat entries in the conversations list view', () => {
        const messages = [
            "Hey how are you",
            "I'm depressed. How about you?",
            "Same here. Jinx!",
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