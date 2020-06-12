const matcher = /%(.*?)%/g;

export default (src: string, objects: Record<string, string>) => {
  const matchedArray = matcher.exec(src);
  if (!matchedArray || matchedArray.length <= 1) {
    throw new Error(`No maching string:${src} ${JSON.stringify(objects)}`);
  }

  return matchedArray.slice(1).reduce(
    (prev, current) =>
      // 抽出できた文字列を舐めて、それをsrc文字列内の%変数名%に対して置換していく
      prev.replace(matcher, objects[current]),
    src
  );
};
