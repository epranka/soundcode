import * as Tone from "tone";
import Instrument from "./Instrument";

const drums = new Instrument("drums", Tone.Players, {
  kick: "./ogg/drums/Kick.ogg",
  openhat: "./ogg/drums/OpenHat.ogg",
  closedhat: "./ogg/drums/ClosedHat.ogg",
  clap: "./ogg/drums/Clap.ogg"
});

drums.label = "Drums";

export default drums;
