import * as Tone from "tone";
import { INote } from "../types";
import { note as parseNote } from "@tonaljs/tonal";
import ts from "typescript";
import Instrument from "../instruments/Instrument";

interface INotesPlayerOptions {
  instrument: Instrument;
  inotes: INote[];
  repeat: boolean;
}

interface ICallbacks {
  end: (() => any)[];
  note: ((
    instrumentName: string,
    note: string | string[],
    node: ts.Node | null
  ) => any)[];
}

export class INotesPlayer {
  instrument: Instrument;
  inotes: INote[];
  repeat: boolean;
  private resolution: number = 128;
  private loop: any;
  private note_counter: number = 0;
  private bar_counter: number = 0;
  private bar_fill: number = 0;
  private bar: number = 0;
  private callbacks: ICallbacks = {
    end: [],
    note: []
  };
  constructor(options: INotesPlayerOptions) {
    this.instrument = options.instrument;
    this.inotes = options.inotes;
    this.repeat = options.repeat;

    this.loop = new Tone.Loop(
      this.loopCallback.bind(this),
      this.resolution + "n"
    );

    this.handleTransportStart = this.handleTransportStart.bind(this);
    this.handleTransportStop = this.handleTransportStop.bind(this);

    Tone.Transport.on("start", this.handleTransportStart);
    Tone.Transport.on("stop", this.handleTransportStop);
  }

  public start() {
    this.loop.start();
  }

  public stop() {
    this.loop.stop();
  }

  private notifyEnd() {
    if (this.callbacks["end"]) {
      for (const callback of this.callbacks["end"]) {
        callback();
      }
    }
  }

  public destroy() {
    Tone.Transport.off("stop", this.handleTransportStop);
    this.callbacks = { end: [], note: [] };
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

  private handleTransportStop() {
    this.note_counter = 0;
    this.bar_counter = 0;
    this.bar_fill = 0;
    this.bar = 0;
  }

  private handleTransportStart() {
    if (this.inotes.length == 0) {
      this.notifyEnd();
    }
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
    // manage bar fill
    if (this.bar_fill > 0) this.bar_fill--;
    // manage notes
    if (this.bar_fill === 0 && this.note_counter < this.inotes.length) {
      const { note, duration, velocity, sustain, play, display } = this.inotes[
        this.note_counter
      ];
      this.bar_fill += this.resolution / duration;
      const durationWithSustain = sustain ? sustain : duration;
      if (note !== "r") {
        this.notify(note, display);
        if (typeof play === "function") {
          if (Array.isArray(note)) {
            for (const n of note) {
              play(this.instrument, n, duration, time, velocity);
            }
          } else {
            play(this.instrument, note, duration, time, velocity);
          }
        } else {
          if (this.isNoteValid(note)) {
            this.instrument
              .it()
              .triggerAttackRelease(
                note,
                durationWithSustain + "n",
                time,
                velocity
              );
          }
        }
      }
      this.note_counter++;
      if (this.note_counter >= this.inotes.length) {
        if (this.repeat) {
          this.note_counter = 0;
        } else {
          this.notifyEnd();
        }
      }
    }

    // manage bar
    this.bar_counter++;
    if (this.bar_counter === this.resolution) {
      this.bar_counter = 0;
      this.bar++;
    }
  }
}

const createNotesPlayer = (
  instrument,
  notes: INote[] = [],
  repeat: boolean = false
) => {
  return new INotesPlayer({ instrument, inotes: notes, repeat });
};

export default createNotesPlayer;
