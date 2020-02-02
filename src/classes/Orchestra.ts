import { chord as parseChord } from "@tonaljs/chord";
import {
  majorKey as parseMajorKey,
  minorKey as parseMinorKey
} from "@tonaljs/key";
import { note as parseNote } from "@tonaljs/tonal";
import * as esprima from "esprima";
import { max, min } from "lodash";
import ts from "typescript";
import isDebug from "../isDebug";
import { INote, ITimeNote } from "../types";
import { mapPower2, mapRange, sumOfP2 } from "../utils";
import calculateMood from "../utils/calculateMood";
import calculateProgression from "../utils/calculateProgression";
import createArpeggio, {
  calculateArpeggioIndex
} from "../utils/createArpeggio";
import getChordHarmonic from "../utils/getChordHarmonic";
import roman from "../utils/roman";

const collectAllNodes = (nodes: ts.Node[], result: ts.Node[] = []) => {
  for (const node of nodes) {
    collectAllNodes(node.getChildren(), result);
    result.push(node);
  }
};

interface INotePosition {
  bar: number;
  positionInBar: number;
  inote: INote;
}

type Bar = INotePosition[];

interface INodePosition {
  bar: number;
  positionInBar: number;
  node: ts.Node;
}

class Orchestra {
  nodes: ts.Node[] = [];
  inodes: INodePosition[] = [];
  minIdentifierWeight: number;
  maxIdentifierWeight: number;
  bars: Bar[] = [[]];
  chords: string[][];
  minSpecialWeight: number;
  maxSpecialWeight: number;
  source: string;
  scale: string;
  progression: string[];
  arpeggioIndex: number;
  constructor(source: string) {
    this.source = source;
    this.getNodes();
    this.scale = this.getScale();
    if (isDebug) {
      console.log("SCALE", this.scale);
    }
    this.progression = this.getProgression();
    if (isDebug) {
      console.log("PROGRESSION", this.progression);
    }
    this.arpeggioIndex = this.getArpeggio();
    if (isDebug) {
      console.log("ARPEGGIO INDEX", this.arpeggioIndex);
    }
    this.chords = this.getChords();
    this.createIdentifierWeights();
    this.createSpecialWeights();
    this.collectMelodyBars();
  }

  public static validateSource(source: string) {
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React }
    });
    esprima.parseScript(outputText, { jsx: true });
  }

  private getNodes() {
    const sc = ts.createSourceFile(
      "sound.tsx",
      this.source,
      ts.ScriptTarget.Latest,
      true
    );
    const sourceFileNode = sc.getChildren()[0];
    collectAllNodes(sourceFileNode.getChildren(), this.nodes);
  }

  getBarsCount() {
    return this.bars.length;
  }

  getFemaleChorusITNotes() {
    const groupedByBar: {
      [bar: number]: { node: ts.Node; weight: number }[];
    } = {};
    for (const inode of this.inodes) {
      if (ts.isStringLiteral(inode.node)) {
        if (!groupedByBar[inode.bar]) groupedByBar[inode.bar] = [];
        const text = inode.node.getText();
        const weight = this.getTextWeight(text);
        groupedByBar[inode.bar].push({ node: inode.node, weight });
      }
    }
    const itnotes: ITimeNote[] = [];
    for (const bar in groupedByBar) {
      const weight =
        groupedByBar[bar].reduce((acc, { weight }) => acc + weight, 0) /
        groupedByBar[bar].length;
      const chordNotes = this.getBarChord(parseInt(bar));
      const nodeIndex = Math.round(
        mapRange(
          weight,
          this.minIdentifierWeight,
          this.maxIdentifierWeight,
          0,
          chordNotes.length - 1
        )
      );
      const note = chordNotes[nodeIndex];
      itnotes.push({
        bar: parseInt(bar),
        beat: 0,
        note: parseNote(note).pc + 3,
        duration: 1,
        velocity: 0.2,
        display: groupedByBar[bar][0].node
      });
    }
    return itnotes;
  }

  getHatITNotes() {
    const notes: ITimeNote[] = [];
    for (const inode of this.inodes) {
      if (ts.isNumericLiteral(inode.node)) {
        const text = inode.node.getText();
        const item = Math.round(parseFloat(text));
        notes.push({
          note: item % 2 === 0 ? "openhat" : "closedhat",
          bar: inode.bar,
          beat: inode.positionInBar,
          play: (instrument, note, duration, time) => {
            instrument
              .it()
              .get(note)
              .start(time);
          },
          duration: 8,
          velocity: 0.8,
          display: inode.node
        });
      }
    }
    return notes;
  }

  getBassITNotes() {
    const notes: ITimeNote[] = [];
    const speed = 8;
    for (let bar = 0; bar < this.bars.length; bar++) {
      const chordNotes = this.getBarChord(bar);
      for (let i = 0; i < speed; i++) {
        const beat = i / speed;
        const note = chordNotes[i % chordNotes.length];
        notes.push({
          note: parseNote(note).pc + 3,
          duration: speed,
          bar: bar,
          beat: beat,
          velocity: 0.2,
          display: null
        });
      }
    }
    return notes;
  }

  getBeatITNotes() {
    const notes: ITimeNote[] = [];
    for (let i = 0; i < 4; i++) {
      const beat = i / 4;
      notes.push({
        note: "kick",
        duration: 4,
        play: (instrument, note, duration, time) => {
          instrument
            .it()
            .get(note)
            .start(time);
        },
        beat,
        display: null
      });
      if (i % 2 === 1) {
        notes.push({
          note: "clap",
          duration: 4,
          play: (instrument, note, duration, time) => {
            instrument
              .it()
              .get(note)
              .start(time);
          },
          beat,
          display: null
        });
      }
    }

    return notes;
  }

  getChordsINotes() {
    const notes: INote[] = [];
    for (const chord of this.chords) {
      const chordNotes = createArpeggio(chord, this.arpeggioIndex);
      notes.push(...chordNotes);
    }
    return notes;
  }

  getMelodyINotes() {
    return this.bars.reduce((acc, bar) => {
      acc.push(...bar.map(({ inote }) => inote));
      return acc;
    }, [] as INote[]);
  }

  getCelloINotes() {
    const notes: INote[] = [];
    for (let bar = 0; bar < this.bars.length; bar++) {
      const chord = this.chords[bar % this.chords.length];
      const bassNote = chord[0];
      notes.push({ note: bassNote, duration: 1, velocity: 0.3, display: null });
    }
    return notes;
  }

  getFluteITNotes() {
    const itnotes: ITimeNote[] = [];
    for (const inode of this.inodes) {
      if (ts.isIdentifier(inode.node)) {
        const text = inode.node.getText();
        const chord = this.getBarChord(inode.bar);
        const chordNotes = getChordHarmonic(chord);
        const weight = this.getTextWeight(text);
        const nodeIndex = Math.round(
          mapRange(
            weight,
            this.minIdentifierWeight,
            this.maxIdentifierWeight,
            0,
            chordNotes.length - 1
          )
        );
        const note = chordNotes[nodeIndex];
        itnotes.push({
          bar: inode.bar,
          beat: inode.positionInBar,
          note: parseNote(note).pc + 5,
          duration: 4,
          velocity: 0.1,
          display: inode.node
        });
      }
    }
    return itnotes;
  }

  getTubaSTCINotes() {
    const inotes: INote[] = [];
    const melodyNotes = this.getMelodyINotes();
    for (const note of melodyNotes) {
      if (note.note !== "r" && note.duration > 4) {
        inotes.push({ ...note, sustain: note.duration, velocity: 0.5 });
      } else {
        inotes.push({ ...note, note: "r" });
      }
    }
    return inotes;
  }

  getHarpITNotes() {
    const itnotes: ITimeNote[] = [];
    for (const inode of this.inodes) {
      if (this.isSpecialCharacter(inode.node)) {
        const text = inode.node.getText();
        const index = text.charCodeAt(0);
        const bar = inode.bar;
        const beat = inode.positionInBar;
        if (!isNaN(index)) {
          const chord = this.chords[bar % this.chords.length];
          const notes = getChordHarmonic(chord);
          const nodeIndex = Math.round(
            mapRange(
              index,
              this.minSpecialWeight,
              this.maxSpecialWeight,
              0,
              notes.length - 1
            )
          );
          const note = notes[nodeIndex];
          itnotes.push({
            note,
            bar,
            beat,
            duration: 16,
            velocity: 0.6,
            display: inode.node
          });
        }
      }
    }
    return itnotes;
  }

  private getBarChord(bar: number) {
    return this.chords[bar % this.chords.length];
  }

  private getTextWeight(text) {
    return text.split("").reduce((acc, t) => acc + t.charCodeAt(0), 0);
  }

  private createIdentifierWeights() {
    const identifierWeights: number[] = [];
    for (const node of this.nodes) {
      if (ts.isToken(node)) {
        if (!this.isSpecialCharacter(node)) {
          const value = node
            .getText()
            .split("")
            .reduce((acc, t) => acc + t.charCodeAt(0), 0);
          identifierWeights.push(value);
        }
      }
    }

    this.minIdentifierWeight = min(identifierWeights) as number;
    this.maxIdentifierWeight = max(identifierWeights) as number;
  }

  private createSpecialWeights() {
    const specialWeights: number[] = [];
    for (const node of this.nodes) {
      if (this.isSpecialCharacter(node)) {
        const text = node.getText();
        const index = text.charCodeAt(0);
        if (!isNaN(index)) {
          specialWeights.push(index);
        }
      }
    }
    this.minSpecialWeight = min(specialWeights) as number;
    this.maxSpecialWeight = max(specialWeights) as number;
  }

  private isSpecialCharacter(node: ts.Node) {
    const text = node.getText();
    return /^[,.;:[\]{}()*=<>/]|(>=)$/.test(text) || text.length === 0;
  }

  /** Count bars by melody, and assign bar, position to nodes */
  private collectMelodyBars() {
    let bar = 0;
    let bar_fill = 1;
    for (const node of this.nodes) {
      let inote: INote;
      if (ts.isToken(node)) {
        this.inodes.push({ bar, positionInBar: 1 - bar_fill, node });
        if (this.isSpecialCharacter(node)) {
          inote = { note: "r", duration: 8, display: node };
        } else {
          const text = node.getText();
          const length = text.length;
          const chord = this.chords[bar % this.chords.length];
          const chordNotes = getChordHarmonic(chord);
          const weight = text
            .split("")
            .reduce((acc, t) => acc + t.charCodeAt(0), 0);
          const nodeIndex = Math.round(
            mapRange(
              weight,
              this.minIdentifierWeight,
              this.maxIdentifierWeight,
              0,
              chordNotes.length - 1
            )
          );
          const note = chordNotes[nodeIndex];
          const duration = mapPower2(Math.min(10, length), 10, 1, 2, 16);
          inote = { note, duration, sustain: 2, display: node };
        }
        const bar_part = 1 / inote.duration;
        if (bar_fill - bar_part >= 0) {
          this.bars[bar].push({
            positionInBar: 1 - bar_fill,
            inote,
            bar
          });
          bar_fill -= bar_part;
        } else {
          const durationsLeft = sumOfP2(bar_fill);
          for (const durationLeftFac of durationsLeft) {
            this.bars[bar].push({
              positionInBar: 1 - durationLeftFac,
              inote: {
                note: "r",
                duration: 1 / durationLeftFac,
                display: null
              },
              bar
            });
          }
          bar_fill = 0;
        }
      }

      if (bar_fill === 0) {
        bar_fill = 1;
        bar++;
        this.bars.push([]);
      }
    }
  }

  private getScale() {
    const mood = calculateMood(this.source);
    return mood;
  }

  private getProgression() {
    const progression = calculateProgression(this.nodes);
    return progression;
  }

  private getChords() {
    const chordOctave: number = 3;
    const chords: string[][] = [];
    const [keyRoot, quality] = this.scale.split(" ");
    const tonic = parseNote(keyRoot).pc;
    let keyChords: string[];
    if (quality === "major") {
      const key = parseMajorKey(tonic);
      keyChords = key.chords;
    } else {
      const key = parseMinorKey(tonic);
      keyChords = key.natural.chords;
    }
    for (const p of this.progression) {
      const i = roman(p.toUpperCase());
      const chord = keyChords[i - 1];
      const chordNotes = parseChord(chord).notes.map(
        root => parseNote(root).pc + chordOctave
      );
      // Remove diminished chord
      chords.push(chordNotes.slice(0, 3));
    }
    return chords;
  }

  private getArpeggio() {
    return calculateArpeggioIndex(this.nodes);
  }
}

export default Orchestra;
