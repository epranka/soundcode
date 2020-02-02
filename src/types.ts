import ts from "typescript";
import Instrument from "./instruments/Instrument";

export interface INote {
  note: string | string[];
  duration: number;
  play?: (instrument: Instrument, note, duration, time, velocity) => any;
  velocity?: number;
  sustain?: number;
  display: ts.Node | null;
}

export interface ITimeNote {
  note: string | string[];
  duration: number;
  play?: (instrument: Instrument, note, duration, time, velocity) => any;
  velocity?: number;
  bar?: number;
  beat: number;
  display: ts.Node | null;
}
