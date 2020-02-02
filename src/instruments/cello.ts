import * as Tone from "tone";
import Instrument from "./Instrument";

const cello = new Instrument("cello", Tone.Sampler, {
  A2: "./ogg/cello/cello-a2.ogg",
  A3: "./ogg/cello/cello-a3.ogg",
  A4: "./ogg/cello/cello-a4.ogg",
  A5: "./ogg/cello/cello-a5.ogg",
  C2: "./ogg/cello/cello-c2.ogg",
  C3: "./ogg/cello/cello-c3.ogg",
  C4: "./ogg/cello/cello-c4.ogg",
  C5: "./ogg/cello/cello-c5.ogg",
  "D#2": "./ogg/cello/cello-ds2.ogg",
  "D#3": "./ogg/cello/cello-ds3.ogg",
  "D#4": "./ogg/cello/cello-ds4.ogg",
  "D#5": "./ogg/cello/cello-ds5.ogg",
  "F#2": "./ogg/cello/cello-fs2.ogg",
  "F#3": "./ogg/cello/cello-fs3.ogg",
  "F#4": "./ogg/cello/cello-fs4.ogg",
  "F#5": "./ogg/cello/cello-fs5.ogg"
});

cello.label = "Cello";

export default cello;
