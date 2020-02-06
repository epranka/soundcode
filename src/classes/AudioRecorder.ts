import * as Tone from "tone";

class AudioRecorder {
  private context: AudioContext;
  private recorder: MediaRecorder;
  private chunks: Blob[] = [];

  destination: MediaStreamAudioDestinationNode;

  constructor() {
    if (typeof MediaRecorder !== "undefined") {
      this.context = Tone.context;
      this.destination = this.context.createMediaStreamDestination();
      this.recorder = new MediaRecorder(this.destination.stream);

      this.recorder.ondataavailable = this.handleDataAvailable.bind(this);
    }
  }

  public isAvailable() {
    return typeof MediaRecorder !== "undefined";
  }

  private handleDataAvailable(event: BlobEvent) {
    this.chunks.push(event.data);
  }

  public start() {
    if (typeof MediaRecorder !== "undefined") {
      this.clear();
      this.recorder.start();
    }
  }

  public stop() {
    if (typeof MediaRecorder !== "undefined") {
      if (this.recorder.state === "recording") this.recorder.stop();
    }
  }

  public getAudioRecordBlob() {
    return new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
  }

  public clear() {
    this.chunks = [];
  }
}

export default new AudioRecorder();
