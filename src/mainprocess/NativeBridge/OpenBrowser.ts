import { exec } from "child_process";
import osSelector from "./OSSelector";

export default function openBrowser(url: string) {
  osSelector({
    win32: () => {
      exec(`start ${url}`);
    },
  });
}
