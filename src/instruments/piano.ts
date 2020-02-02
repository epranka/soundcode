import * as Tone from "tone";
import Instrument from "./Instrument";

const getSamplerData = () => {
  const velocity = 10;
  const notes = ["A", "C", "D#", "F#"];
  const octaves = [1, 2, 3, 4, 5, 6, 7];
  return octaves.reduce((acc, octave) => {
    return notes.reduce((acc, note) => {
      acc[note + octave] =
        "./ogg/piano/" +
        note.replace("#", "s") +
        octave +
        "v" +
        velocity +
        ".ogg";
      return acc;
    }, acc);
  }, {});
};
// const piano = new Tone.Sampler(getSamplerData()).toMaster();

// piano.name = "piano";

const piano = new Instrument("piano", Tone.Sampler, getSamplerData());

piano.label = "Piano";

export default piano;
