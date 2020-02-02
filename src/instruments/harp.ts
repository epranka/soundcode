import * as Tone from "tone";
import Instrument from "./Instrument";

const harp = new Instrument("harp", Tone.Sampler, {
  A2: "./ogg/harp/harp-a2.ogg",
  A3: "./ogg/harp/harp-a3.ogg",
  A4: "./ogg/harp/harp-a4.ogg",
  A5: "./ogg/harp/harp-a5.ogg",
  A6: "./ogg/harp/harp-a6.ogg",
  C2: "./ogg/harp/harp-c2.ogg",
  C3: "./ogg/harp/harp-c3.ogg",
  C4: "./ogg/harp/harp-c4.ogg",
  C5: "./ogg/harp/harp-c5.ogg",
  C6: "./ogg/harp/harp-c6.ogg",
  C7: "./ogg/harp/harp-c7.ogg",
  "D#2": "./ogg/harp/harp-ds2.ogg",
  "D#3": "./ogg/harp/harp-ds3.ogg",
  "D#4": "./ogg/harp/harp-ds4.ogg",
  "D#5": "./ogg/harp/harp-ds5.ogg",
  "D#6": "./ogg/harp/harp-ds6.ogg",
  "F#2": "./ogg/harp/harp-fs2.ogg",
  "F#3": "./ogg/harp/harp-fs3.ogg",
  "F#4": "./ogg/harp/harp-fs4.ogg",
  "F#5": "./ogg/harp/harp-fs5.ogg",
  "F#6": "./ogg/harp/harp-fs6.ogg"
});

harp.label = "Harp";

export default harp;
