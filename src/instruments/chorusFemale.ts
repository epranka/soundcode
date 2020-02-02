import * as Tone from "tone";
import Instrument from "./Instrument";

const chorusFemale = new Instrument("chorus-female", Tone.Sampler, {
  A4: "./ogg/chorus/chorus-female-a4.ogg",
  A5: "./ogg/chorus/chorus-female-a5.ogg",
  "A#4": "./ogg/chorus/chorus-female-as4.ogg",
  "A#5": "./ogg/chorus/chorus-female-as5.ogg",
  B4: "./ogg/chorus/chorus-female-b4.ogg",
  B5: "./ogg/chorus/chorus-female-b5.ogg",
  C5: "./ogg/chorus/chorus-female-c5.ogg",
  C6: "./ogg/chorus/chorus-female-c6.ogg",
  D5: "./ogg/chorus/chorus-female-d5.ogg",
  "D#5": "./ogg/chorus/chorus-female-ds5.ogg",
  E5: "./ogg/chorus/chorus-female-e5.ogg",
  F5: "./ogg/chorus/chorus-female-f5.ogg",
  "F#5": "./ogg/chorus/chorus-female-fs5.ogg",
  G4: "./ogg/chorus/chorus-female-g4.ogg",
  G5: "./ogg/chorus/chorus-female-g5.ogg",
  "G#4": "./ogg/chorus/chorus-female-gs4.ogg",
  "G#5": "./ogg/chorus/chorus-female-gs5.ogg"
});

chorusFemale.label = "Chorus";

export default chorusFemale;
