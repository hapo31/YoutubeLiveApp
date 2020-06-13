import { ipcRenderer } from "electron";

function init() {
  try {
    ipcRenderer.send("DEBUG.SHOW_LOG", "init()");
    if (location.href.indexOf("livestreaming/dashboard") < 0) {
      setTimeout(() => {
        init();
      }, 1000);
      return;
    }
    const chatItemElement = document.getElementById("items");
    if (chatItemElement == null) {
      setTimeout(() => {
        init();
      }, 1000);
      return;
    }

    ipcRenderer.send("DEBUG.SHOW_LOG", "Chat attached.");
    const observer = new MutationObserver((records, observer) => {
      ipcRenderer.send("DEBUG.SHOW_LOG", records);
      observer.takeRecords(); // 古いやつは捨てる
    });

    ipcRenderer.send("DEBUG.SHOW_LOG", chatItemElement);
    observer.observe(chatItemElement, {
      characterData: true,
    });
  } catch (e) {
    ipcRenderer.send("DEBUG.ERROR_LOG", e);
  }
}

function extractChat() {}

init();
