const matcher = /%(.*?)%/g.compile();

export default (src: string, objects: Record<string, string>) => {
  if (!matcher.test(src)) {
    return "";
  }

  const matches = matcher.exec(src);
  if (!matches) {
    return "";
  }

  return matches.reduce(
    (prev, current) =>
      // 抽出できた文字列を舐めて、それをsrc文字列内の%変数名%に対して置換していく
      prev.replace(new RegExp(`%${current}%`, "g"), objects[current]),
    src
  );
};
