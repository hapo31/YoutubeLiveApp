import sendDebugLog from "../debug/sendDebugLog";

export default function attachChatBox(chatItemElement: HTMLElement, onReceiveChat: (element: ChildNode) => void) {
  sendDebugLog("Chat attached.");
  const observer = new MutationObserver((records, observer) => {
    if (records.length >= 1) {
      const nodes = records[0].addedNodes.item(0);
      if (nodes == null) {
        return;
      }

      const targetNode = nodes.childNodes[2] as HTMLElement;
      onReceiveChat(targetNode);
    }
    observer.takeRecords(); // 古いやつは捨てる
  });
  observer.observe(chatItemElement, { childList: true });
}

function isSuperChat(node: ChildNode) {
  return (node as HTMLElement).querySelector("#card") !== null;
}

function parseSuperChatCard(element: HTMLElement) {
  document.body.appendChild(element);
}

function parseChat(element: HTMLElement) {
  return;
}
