import * as Tone from "tone";
import Instrument from "./Instrument";

const tubaSTC = new Instrument("tuba-stc", Tone.Sampler, {
  "A#1": "./ogg/tuba-stc/tuba-stc-rr1-as1.ogg",
  "A#2": "./ogg/tuba-stc/tuba-stc-rr1-as2.ogg",
  "A#3": "./ogg/tuba-stc/tuba-stc-rr1-as3.ogg",
  "C#2": "./ogg/tuba-stc/tuba-stc-rr1-cs2.ogg",
  "C#3": "./ogg/tuba-stc/tuba-stc-rr1-cs3.ogg",
  "C#4": "./ogg/tuba-stc/tuba-stc-rr1-cs4.ogg",
  E1: "./ogg/tuba-stc/tuba-stc-rr1-e1.ogg",
  E2: "./ogg/tuba-stc/tuba-stc-rr1-e2.ogg",
  E3: "./ogg/tuba-stc/tuba-stc-rr1-e3.ogg",
  G1: "./ogg/tuba-stc/tuba-stc-rr1-g1.ogg",
  G2: "./ogg/tuba-stc/tuba-stc-rr1-g2.ogg",
  G3: "./ogg/tuba-stc/tuba-stc-rr1-g3.ogg"
});

tubaSTC.label = "Tuba";

export default tubaSTC;
