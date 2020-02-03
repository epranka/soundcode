import * as Tone from "tone";
import ts from "typescript";
import bass from "../instruments/bass";
import cello from "../instruments/cello";
import chorusFemale from "../instruments/chorusFemale";
import drums from "../instruments/drums";
import flute from "../instruments/flute";
import harp from "../instruments/harp";
import piano from "../instruments/piano";
import tubaSTC from "../instruments/tuba-stc";
import createNotesPlayer, { INotesPlayer } from "../players/createNotesPlayer";
import createTimeNotesPlayer, {
  ITimeNotesPlayer
} from "../players/createTimeNotesPlayer";
import AudioRecorder from "./AudioRecorder";
import Orchestra from "./Orchestra";

interface ICallbacks {
  end: (() => any)[];
  notify: ((text: string) => any)[];
}

class Conductor {
  orchestra: Orchestra;
  beatLoop: ITimeNotesPlayer;
  chordsLoop: INotesPlayer;
  pianoArtist: INotesPlayer;
  celloArtist: INotesPlayer;
  harpArtist: ITimeNotesPlayer;
  fluteArtist: ITimeNotesPlayer;
  tubaSTCArtist: INotesPlayer;
  chorusFemaleArtist: ITimeNotesPlayer;
  hatArtist: ITimeNotesPlayer;
  bassLoop: ITimeNotesPlayer;

  private callbacks: ICallbacks = {
    end: [],
    notify: []
  };

  constructor(orchestra: Orchestra) {
    this.orchestra = orchestra;
    this.beatLoop = this.createBeatLoop();
    this.chordsLoop = this.createChordsLoop();
    this.bassLoop = this.createBassLoop();
    this.hatArtist = this.createHatArtist();
    this.pianoArtist = this.createPianoArtist();
    this.celloArtist = this.createCelloArtist();
    this.harpArtist = this.createHarpArtist();
    this.fluteArtist = this.createFluteArtist();
    this.tubaSTCArtist = this.createTubaSTCArtist();
    this.chorusFemaleArtist = this.createChorusFemaleArtist();

    this.beatLoop.start();
    this.chordsLoop.start();
    this.bassLoop.start();
    this.hatArtist.start();
    this.pianoArtist.start();
    this.celloArtist.start();
    this.harpArtist.start();
    this.fluteArtist.start();
    this.tubaSTCArtist.start();
    this.chorusFemaleArtist.start();

    this.notify = this.notify.bind(this);
    this.handlePianoEnd = this.handlePianoEnd.bind(this);
  }

  public getDurationInSeconds() {
    const bars = this.orchestra.getBarsCount();
    const beats = bars * 4;
    const bpm = Tone.Transport.bpm.value;
    return (beats / bpm) * 60;
  }

  public play() {
    this.pianoArtist.on("end", this.handlePianoEnd);
    this.pianoArtist.on("note", this.notify);
    this.harpArtist.on("note", this.notify);
    this.chorusFemaleArtist.on("note", this.notify);
    this.hatArtist.on("note", this.notify);

    AudioRecorder.start();
    this.harpArtist.instrument.it().volume.value -= 2;
    this.tubaSTCArtist.instrument.it().volume.value -= 2;
    Tone.Transport.start();
  }

  public stop() {
    this.pianoArtist.off("end", this.handlePianoEnd);
    this.pianoArtist.off("note", this.notify);
    this.harpArtist.off("note", this.notify);
    this.chorusFemaleArtist.off("note", this.notify);
    this.hatArtist.off("note", this.notify);

    AudioRecorder.stop();
    Tone.Transport.stop();
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

  private notify(
    instrumentName: string,
    note: string | string[],
    node: ts.Node | null
  ) {
    if (node) {
      const text = this.orchestra.source.substring(node.pos, node.end).trim();
      for (const callback of this.callbacks.notify) {
        callback(text);
      }
    }
  }

  public destroy() {
    this.callbacks = { end: [], notify: [] };
    this.beatLoop.destroy();
    this.chordsLoop.destroy();
    this.bassLoop.destroy();
    this.hatArtist.destroy();
    this.pianoArtist.destroy();
    this.celloArtist.destroy();
    this.harpArtist.destroy();
    this.fluteArtist.destroy();
    this.tubaSTCArtist.destroy();
    this.chorusFemaleArtist.destroy();
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  private handlePianoEnd() {
    setTimeout(() => {
      this.stop();
      for (const callback of this.callbacks["end"]) {
        callback();
      }
    }, 2000);
  }

  private createBeatLoop() {
    return createTimeNotesPlayer(drums, this.orchestra.getBeatITNotes());
  }

  private createChordsLoop() {
    return createNotesPlayer(piano, this.orchestra.getChordsINotes(), true);
  }

  private createPianoArtist() {
    return createNotesPlayer(piano, this.orchestra.getMelodyINotes());
  }

  private createCelloArtist() {
    return createNotesPlayer(cello, this.orchestra.getCelloINotes());
  }

  private createHarpArtist() {
    return createTimeNotesPlayer(harp, this.orchestra.getHarpITNotes());
  }

  private createFluteArtist() {
    return createTimeNotesPlayer(flute, this.orchestra.getFluteITNotes());
  }

  private createTubaSTCArtist() {
    return createNotesPlayer(tubaSTC, this.orchestra.getTubaSTCINotes());
  }

  private createChorusFemaleArtist() {
    return createTimeNotesPlayer(
      chorusFemale,
      this.orchestra.getFemaleChorusITNotes()
    );
  }

  private createHatArtist() {
    return createTimeNotesPlayer(drums, this.orchestra.getHatITNotes());
  }

  private createBassLoop() {
    return createTimeNotesPlayer(bass, this.orchestra.getBassITNotes());
  }
}

export default Conductor;
