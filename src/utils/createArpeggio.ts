import ts from "typescript";
import { INote } from "../types";

const arpeggios = {
  0: ["1n1,2,3"],
  1: ["2n1s1,2,3", "8n2", "8n3", "8n2", "8n1"],
  2: ["8n4s1", "8n2", "8n4s3", "8n1", "8n4s2", "8n3", "8n4s2", "8n1"],
  3: ["2n1s1,2,3", "4nr", "4n3"],
  4: ["8n2s1", "8n2s2", "8n2s1", "8n2s3", "8n2s2", "8n2s3", "8n2s2", "8n2s1"]
  // 4: [
  // "8n0.6v1,2,3",
  // "8n0.6v1,2,3",
  // "8n0.6v1,2,3",
  // "8n0.6v1,2,3",
  // "8n0.6v1,2,3",
  // "8n0.6v1,2,3",
  // "8n0.6v1,2,3",
  // "8n0.6v1,2,3"
  // ]
};

export const calculateArpeggioIndex = (nodes: ts.Node[]) => {
  const loopCounts = nodes.filter(
    node =>
      ts.isForStatement(node) ||
      ts.isForOfStatement(node) ||
      ts.isForInStatement(node) ||
      ts.isWhileStatement(node) ||
      ts.isDoStatement(node)
  ).length;
  return loopCounts % Object.keys(arpeggios).length;
};

const createArpeggio = (chord: string[], arpeggioIndex: number): INote[] => {
  const arpeggio = arpeggios[arpeggioIndex];
  const result: INote[] = [];
  for (const a of arpeggio) {
    const durationMatch = /\d+n/.exec(a);
    if (!durationMatch)
      throw new Error("No duration in arpeggio notation: " + a);
    const duration = parseInt(durationMatch[0]);
    const velocityMatch = /\d+(.\d+)?v/.exec(a);
    const velocity = velocityMatch ? parseFloat(velocityMatch[0]) : undefined;
    const sustainMatch = /\d+s/.exec(a);
    const sustain = sustainMatch ? parseInt(sustainMatch[0]) : undefined;
    const positionsMatch = /[\d,r]+$/.exec(a);
    if (!positionsMatch)
      throw new Error("No positions in arpeggio notation: " + a);
    const positionsString = positionsMatch[0];
    if (positionsString === "r") {
      result.push({ note: "r", duration, display: null });
    } else {
      const notes: string[] = [];
      const positions = positionsString.split(",");
      for (const position of positions) {
        notes.push(chord[parseInt(position) - 1]);
      }
      result.push({ note: notes, duration, velocity, sustain, display: null });
    }
  }
  return result;
};

export default createArpeggio;
