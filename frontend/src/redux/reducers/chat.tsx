const initialState = {
    chats: [],
    current_message: ""
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case "update_current_message":
            return {
                ...state,
                current_message: action.current_message
            }

        default:
            return state;
    }
}

export default chatReducer;