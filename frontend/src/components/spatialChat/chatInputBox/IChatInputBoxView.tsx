import { ChatEditorType } from "../../../classes/SpatialChat";

interface IChatInputBoxView {
    onInputSubmit: (chatMessage: string) => Promise<void>;
    chatEditorType: ChatEditorType;
}

export default IChatInputBoxView;