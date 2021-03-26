interface IChatInputBoxView {
    value: string;
    onInputChanged: (inputValue: string) => void;
    onInputSubmit: () => Promise<void>;
}

export default IChatInputBoxView;