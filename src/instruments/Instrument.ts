import AudioRecorder from "../classes/AudioRecorder";

interface ICallbacks {
  load: (() => any)[];
}

class Instrument {
  name: string;
  label: string;
  loaded: boolean = false;
  private callbacks: ICallbacks = {
    load: []
  };
  private instance: any;
  private ToneType: any;
  private samples: any;
  constructor(name, ToneType, samples) {
    this.ToneType = ToneType;
    this.samples = samples;
    this.name = name;

    this.handleOnLoad = this.handleOnLoad.bind(this);
  }

  public async load() {
    const self = this;
    return new Promise(resolve => {
      self.instance = new self.ToneType(self.samples, () => {
        self.handleOnLoad();
        self.instance.volume.value -= 8;
        if (AudioRecorder.isAvailable()) {
          self.instance.connect(AudioRecorder.destination);
        }
        resolve();
      }).toMaster();
    });
  }

  public on<T extends keyof ICallbacks>(type: T, callback: ICallbacks[T][0]) {
    if (!this.callbacks[type].includes(callback as any)) {
      this.callbacks[type].push(callback as any);
    }

    // handle already loaded
    if (type === "load" && this.loaded) {
      callback();
    }
  }

  public off<T extends keyof ICallbacks>(type: T, callback: ICallbacks[T][0]) {
    this.callbacks[type] = this.callbacks[type].filter(
      c => c !== callback
    ) as any;
  }

  public it() {
    if (!this.instance)
      throw new Error("Load instrument before use it: " + this.name);
    return this.instance;
  }

  private handleOnLoad() {
    this.loaded = true;
    for (const callback of this.callbacks["load"]) {
      callback();
    }
  }
}

export default Instrument;
