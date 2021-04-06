interface IChatInputBoxView {
    onInputSubmit: (chatMessage: string) => Promise<void>;
}

export default IChatInputBoxView;