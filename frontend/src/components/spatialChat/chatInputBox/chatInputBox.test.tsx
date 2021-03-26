/* eslint-disable no-await-in-loop,@typescript-eslint/no-loop-func,no-restricted-syntax */
import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../../../redux/reducers';
import ChatInputBox from './index'


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
    const Wrapper: React.FC = ({ children }) => {
        return <Provider store={store}>{children}</Provider>
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

const mockUseCoveyAppState = jest.fn(() => (Promise.resolve()));
jest.mock('../../../hooks/useCoveyAppState', () => ({
    __esModule: true, // this property makes it work
    default: () => (mockUseCoveyAppState)
}));

describe('Rendering the conversations list view', () => {
    it('Test if the chat-input-box is loaded on the screen', () => {
        const renderedElement = render(
            <ChatInputBox />,
        );
        renderedElement.getByTestId("chat-input-box-wrapper");
        renderedElement.getByRole('button', { name: /send/ });
    })

    it('Test if send a message triggers a socket call', () => {
        const { } = render(
            <ChatInputBox />,
        );
        // TODO:
    })

});