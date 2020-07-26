import { compose, applyMiddleware, createStore } from "redux";
import RendererProcessMiddleware, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";

// eslint-disable-next-line
(window as any).preloadInit = async () => {
  const myCreateStore = compose(applyMiddleware(RendererProcessMiddleware()))(createStore);
  const store = myCreateStore(createAppReducer(await requestInitialState()));

  function init() {
    setInterval(() => {
      console.log("alive preload");
    }, 1000);
  }

  init();
};

// eslint-disable-next-line
(window as any).preloadInit();
