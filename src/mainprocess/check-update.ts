/// <reference >

import request from "request";
import compare from "node-version-compare";

// 脳が死んでる時に作りました
export default async function checkUpdate(appVersion: string): Promise<string[]> {
  return new Promise((result) => {
    request.get(
      {
        url: "https://api.github.com/repos/happou31/YoutubeLiveApp/releases/latest",
        headers: {
          "User-Agent": "YoutubeLiveApp",
        },
      },
      (_err, res, _body) => {
        const jsonObject = JSON.parse(res.body);
        if (compare(appVersion, jsonObject.tag_name) < 0) {
          console.log("find releases.");
          result([appVersion, jsonObject.tag_name]);
          return;
        } else {
          console.log("no releases.");
          result([]);
        }
        return;
      }
    );
  });
}
