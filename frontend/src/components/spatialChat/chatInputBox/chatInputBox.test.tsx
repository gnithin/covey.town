/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-await-in-loop,@typescript-eslint/no-loop-func,no-restricted-syntax */
import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { render as rtlRender, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../../../redux/reducers';
import ChatInputBox from './index';
import Constants from '../../../constants';


// TODO: This needs to be put in a test-utils of some sort. This pattern
// is used in the containerslist as well.
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
// @ts-ignore
mockUseCoveyAppState.socket = jest.fn();
// @ts-ignore
mockUseCoveyAppState.socket.emit = jest.fn();

describe('Rendering the conversations list view', () => {
    it('Test if the chat-input-box is loaded on the screen', () => {
        const renderedElement = render(
            <ChatInputBox />,
        );
        renderedElement.getByTestId("chat-input-box-wrapper");
        renderedElement.getByRole('button', { name: /send-chat/ });
    })

    it('Test if send a message triggers a socket call', () => {
        const { getByRole, getByPlaceholderText } = render(
            <ChatInputBox />,
        );
        const chatInput = getByPlaceholderText(/say something/i)

        const inputString = 'Hello!';
        fireEvent.change(chatInput, { target: { value: inputString } })

        const sendBtn = getByRole('button', { name: /send-chat/ });
        sendBtn.click();

        // Check if the message was sent
        // @ts-ignore
        const mockEmit = mockUseCoveyAppState.socket.emit;

        expect(mockEmit).toBeCalled();
        expect(mockEmit).toBeCalledWith('sendChatMessage', {
            message: inputString,
            broadcastRadius: Constants.DEFAULT_BROADCAST_RADIUS,
        });
    })
});