interface IChatInputBoxView {
    value: string;
    onInputChanged: (inputValue: string) => void;
}

export default IChatInputBoxView;