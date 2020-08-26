/// <reference >

import request from "request";
import fs from "fs";
import compare from "node-version-compare";

// 脳が死んでる時に作りました
export default async function checkUpdate(packageJsonPath: string): Promise<string[]> {
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
        const packageJson = fs.readFileSync(packageJsonPath);
        const packageJsonObject = JSON.parse(packageJson.toString("utf-8"));
        console.log([packageJsonObject.version, jsonObject.tag_name]);
        if (compare(packageJsonObject.version, jsonObject.tag_name) > 0) {
          console.log("find releases.");
          result([packageJsonObject.version, jsonObject.tag_name]);

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
