const marked = require("marked");
const fs = require("fs").promises;

(async () => {
  const buffer = await fs.readFile("./Readme.md");
  const text = await buffer.toString("utf-8");
  const html = marked(text);
  await fs.writeFile("./index.html", html);
})();
