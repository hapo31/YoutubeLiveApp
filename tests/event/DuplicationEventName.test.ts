import { describe, it } from "mocha";
import * as chai from "chai";
import {
  CHANNEL_NAME_FROM_MAIN as mainStateChangedEventName,
  CHANNEL_NAME_FROM_PRELOAD as preloadStateChangedEventName,
} from "@events/StateChangedEvent";
import {
  CHANNEL_NAME_FROM_MAIN as mainInitialStateEventName,
  CHANNEL_NAME_FROM_PRELOAD as preloadInitialStateEventName,
} from "@events/InitialStateEvent";

const eventNameList = [mainStateChangedEventName, preloadStateChangedEventName, mainInitialStateEventName, preloadInitialStateEventName];

describe(__filename, () => {
  it("イベント名に重複がないかをチェケラ", () => {
    eventNameList.reduce<string[]>((prev, current) => {
      chai.assert.isFalse(
        prev.some((eventName) => current === eventName),
        `EventNameが重複: ${current} in [${prev.join(", ")}]`
      );

      return [...prev, current];
    }, []);
  });
});
