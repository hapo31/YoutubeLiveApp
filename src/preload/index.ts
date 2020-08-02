import { compose, applyMiddleware, createStore } from "redux";
import RendererProcessMiddleware, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import { ipcRenderer } from "electron";
import IPCEvent from "@common/events/IPCEvent";

const preloadInit = async () => {
  const myCreateStore = compose(applyMiddleware(RendererProcessMiddleware()))(createStore);
  const store = myCreateStore(createAppReducer(await requestInitialState()));
  let url = location.href;

  function init() {
    // FIXME: ページの切り替えを検知してるけど流石にこれはアホ
    setInterval(() => {
      if (url !== location.href) {
        url = location.href;
        ipcRenderer.send(IPCEvent.NavigationChange.NAVIGATION_PAGE_FROM_PRELOAD, location.href);
      }
    }, 10);
  }

  init();
};

preloadInit();
