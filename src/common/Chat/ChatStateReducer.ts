import * as ChatStateAction from "./ChatStateActions";
import { ChatState } from "./ChatState";

export default function createChatReducer(initialState: ChatState) {
  return (state = initialState, action: ChatStateAction.Actions): ChatState => {
    switch (action.type) {
      case ChatStateAction.INIT_CHAT:
        return {
          ...state,
          willInit: true,
          videoId: action.videoId,
        };

      case ChatStateAction.ATTACH_CHAT:
        return {
          ...state,
          attached: true,
          willInit: false,
        };

      case ChatStateAction.DETACH_CHAT:
        return {
          ...state,
          videoId: "",
          attached: false,
        };
    }

    return state;
  };
}
