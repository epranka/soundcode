import { ITimeNote } from "../types";
import * as Tone from "tone";
import ts from "typescript";
import Instrument from "../instruments/Instrument";
import { note as parseNote } from "@tonaljs/tonal";

interface ITimeNotesPlayerOptions {
  instrument: Instrument;
  itnotes: ITimeNote[];
}

interface ICallbacks {
  note: ((
    instrumentName: string,
    note: string | string[],
    node: ts.Node | null
  ) => any)[];
}

export class ITimeNotesPlayer {
  instrument: Instrument;
  itnotes: ITimeNote[];

  private resolution: number = 128;
  private bar_counter = 0;
  private bar = 0;
  private notesByBarAndBeat: {
    [bar: number]: { [beat: number]: ITimeNote[] };
  } = {};
  private notesByBeat: {
    [beat: number]: ITimeNote[];
  } = {};
  private loop: any;

  private callbacks: ICallbacks = {
    note: []
  };

  constructor(options: ITimeNotesPlayerOptions) {
    this.instrument = options.instrument;
    this.itnotes = options.itnotes;
    this.sortITNotes();

    this.loop = new Tone.Loop(
      this.loopCallback.bind(this),
      this.resolution + "n"
    );

    this.handleTransportStop = this.handleTransportStop.bind(this);

    Tone.Transport.on("stop", this.handleTransportStop);
  }

  public start() {
    this.loop.start();
  }

  public stop() {
    this.loop.stop();
  }

  public destroy() {
    Tone.Transport.off("stop", this.handleTransportStop);
    this.callbacks = { note: [] };
  }

  private handleTransportStop() {
    this.bar_counter = 0;
    this.bar = 0;
  }

  public on<T extends keyof ICallbacks>(type: T, callback: ICallbacks[T][0]) {
    if (!this.callbacks[type].includes(callback as any)) {
      this.callbacks[type].push(callback as any);
    }
  }

  public off<T extends keyof ICallbacks>(type: T, callback: ICallbacks[T][0]) {
    this.callbacks[type] = this.callbacks[type].filter(
      c => c !== callback
    ) as any;
  }

  private notify(note: string | string[], node: ts.Node | null) {
    if (this.callbacks["note"]) {
      for (const callback of this.callbacks["note"]) {
        callback(this.instrument.name, note, node);
      }
    }
  }

  private isNoteValid(note: string | string[]) {
    const notes = Array.isArray(note) ? note : [note];
    let isValid = true;
    for (const note of notes) {
      const parsed = parseNote(note);
      if (parsed.empty) {
        isValid = false;
      }
    }
    return isValid;
  }

  private loopCallback(time) {
    const beat = this.bar_counter / this.resolution;

    const itnotesToPlayByBarAndBeats =
      (this.notesByBarAndBeat[this.bar] &&
        this.notesByBarAndBeat[this.bar][beat]) ||
      [];
    const itnotesToPlayByBeats = this.notesByBeat[beat] || [];
    const itnotesToPlay = [
      ...itnotesToPlayByBarAndBeats,
      ...itnotesToPlayByBeats
    ];
    for (const itnote of itnotesToPlay) {
      if (itnote.note !== "r") {
        this.notify(itnote.note, itnote.display);
      }
      if (typeof itnote.play === "function") {
        itnote.play(
          this.instrument,
          itnote.note,
          itnote.duration,
          time,
          itnote.velocity
        );
      } else {
        if (this.isNoteValid(itnote.note)) {
          this.instrument
            .it()
            .triggerAttackRelease(
              itnote.note,
              itnote.duration + "n",
              time,
              itnote.velocity
            );
        }
      }
    }
    this.bar_counter++;
    if (this.bar_counter === this.resolution) {
      this.bar_counter = 0;
      this.bar++;
    }
  }

  private sortITNotes() {
    this.notesByBarAndBeat = this.itnotes.reduce((acc, itnote) => {
      if (typeof itnote.bar === "number") {
        if (!acc[itnote.bar]) acc[itnote.bar] = {};
        if (!acc[itnote.bar][itnote.beat]) acc[itnote.bar][itnote.beat] = [];
        acc[itnote.bar][itnote.beat].push(itnote);
        return acc;
      } else return acc;
    }, {});

    this.notesByBeat = this.itnotes.reduce((acc, itnote) => {
      if (typeof itnote.bar === "undefined") {
        if (!acc[itnote.beat]) acc[itnote.beat] = [];
        acc[itnote.beat].push(itnote);
        return acc;
      } else return acc;
    }, {});
  }
}

const createTimeNotesPlayer = (instrument, itnotes: ITimeNote[] = []) => {
  return new ITimeNotesPlayer({ instrument, itnotes });
};

export default createTimeNotesPlayer;
