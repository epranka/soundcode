import * as Tone from "tone";
import Instrument from "./Instrument";

const flute = new Instrument("flute", Tone.Sampler, {
  A3: "./ogg/flute/flute-a3.ogg",
  A4: "./ogg/flute/flute-a4.ogg",
  A5: "./ogg/flute/flute-a5.ogg",
  C3: "./ogg/flute/flute-c3.ogg",
  C4: "./ogg/flute/flute-c4.ogg",
  C5: "./ogg/flute/flute-c5.ogg",
  C6: "./ogg/flute/flute-c6.ogg",
  "D#3": "./ogg/flute/flute-ds3.ogg",
  "D#4": "./ogg/flute/flute-ds4.ogg",
  "D#5": "./ogg/flute/flute-ds5.ogg",
  "F#3": "./ogg/flute/flute-fs3.ogg",
  "F#4": "./ogg/flute/flute-fs4.ogg",
  "F#5": "./ogg/flute/flute-fs5.ogg"
});

flute.label = "Flute";

export default flute;
