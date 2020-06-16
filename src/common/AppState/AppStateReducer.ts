import * as AppStateAction from "./Actions/AppStateAction";
import AppState from "./AppState";

export default function createAppReducer(initialState: AppState) {
  return (state = initialState, action: AppStateAction.Actions) => {
    switch (action.type) {
      case AppStateAction.CHANGE_URL:
        return { url: action.url };
    }

    return state;
  };
}
