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
    setInterval(() => {
      if (url !== location.href) {
        url = location.href;
        ipcRenderer.send(IPCEvent.NavigationChange.NAVIGATION_PAGE_FROM_PRELOAD, location.href);
      }
    }, 10);

    // window.onpopstate = (_event: PopStateEvent) => {
    //   ipcRenderer.send(IPCEvent.NavigationChange.NAVIGATION_PAGE_FROM_PRELOAD, location.href);
    //   console.log({ location: location.href });
    // };
  }

  init();
};

preloadInit();
