import ts from "typescript";

const progressions = [
  ["I", "V", "VI", "IV"],
  ["vi", "IV", "I", "V"],
  ["I", "IV", "vi", "V"],
  ["I", "VI", "IV", "V"]
];

const calculateProgression = (nodes: ts.Node[]) => {
  const blockCount = nodes.filter(node => ts.isBlock(node)).length;
  return progressions[blockCount % progressions.length];
};

export default calculateProgression;
