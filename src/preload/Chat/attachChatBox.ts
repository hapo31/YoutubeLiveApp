import sendDebugLog from "../debug/sendDebugLog";

export default function attachChatBox(onReceiveChat: (element: HTMLElement) => void) {
  const observer = new MutationObserver((records, observer) => {
    if (records.length >= 1) {
      const nodes = records[0].addedNodes.item(0);
      if (nodes == null) {
        return;
      }

      const targetNode = nodes.childNodes[2].parentElement;

      if (!targetNode) {
        return;
      }
      console.log({ targetNode });
      onReceiveChat(targetNode);
    }
    observer.takeRecords(); // 古いやつは捨てる
  });

  return [
    (chatItemElement: HTMLElement) => {
      observer.observe(chatItemElement, { childList: true, subtree: true });
      console.log("chat attached");
    },
    () => {
      observer.disconnect();
    },
  ] as const;
}
