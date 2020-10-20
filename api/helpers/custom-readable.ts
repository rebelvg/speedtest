import { Readable } from 'stream';

interface ICustomReadableOptions {
  fileSize: number;
  simulatedSpeed?: number;
}

export class CustomReadable extends Readable {
  private fileSize: number = 0;
  private simulatedSpeed: number = Infinity;

  constructor(options: ICustomReadableOptions) {
    super();

    const { fileSize, simulatedSpeed } = options;

    this.fileSize = fileSize;
    this.simulatedSpeed = simulatedSpeed || Infinity;
  }

  private _pushBytes(bytes: number) {
    if (bytes > this.fileSize) {
      this.push(Buffer.alloc(this.fileSize, 0x00));
    } else {
      this.push(Buffer.alloc(bytes, 0x00));
    }

    this.fileSize -= bytes;
  }

  public _read(bytes: number) {
    if (this.fileSize > 0) {
      this.simulatedSpeed === Infinity
        ? this._pushBytes(bytes)
        : setTimeout(() => this._pushBytes(bytes), ((1000 / this.simulatedSpeed) * bytes) / 1024);
    } else {
      this.push(null);
    }
  }
}
