import * as Tone from "tone";
import Instrument from "./Instrument";

const bass = new Instrument("bass", Tone.Sampler, {
  C3: "./ogg/bass/boffner1.ogg",
  C4: "./ogg/bass/boffner2.ogg"
});

bass.label = "Bass";

export default bass;
