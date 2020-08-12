import * as AppStateAction from "./Actions/AppStateAction";
import AppState from "./AppState";

export default function createAppReducer(initialState: AppState) {
  return (state = initialState, action: AppStateAction.Actions): AppState => {
    switch (action.type) {
      case AppStateAction.CHANGE_URL:
        return {
          ...state,
          nowUrl: action.url,
        };
      case AppStateAction.RECEIVED_SUPERCHAT:
        return {
          ...state,
          superChats: [...state.superChats, action.superChat],
        };

      case AppStateAction.RESET_SUPERCHAT_LIST:
        return {
          ...state,
          superChats: [],
        };
    }

    return state;
  };
}
