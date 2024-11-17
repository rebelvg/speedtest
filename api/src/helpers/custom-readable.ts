import { Readable } from 'stream';

interface ICustomReadableOptions {
  fileSize: number;
  simulatedSpeedKBps?: number;
}

export class CustomReadable extends Readable {
  private fileSize: number = 0;
  private simulatedSpeedKBps: number = Infinity;

  constructor(options: ICustomReadableOptions) {
    super({
      highWaterMark: (options.simulatedSpeedKBps || 16) * 1024,
    });

    const { fileSize, simulatedSpeedKBps } = options;

    this.fileSize = fileSize;
    this.simulatedSpeedKBps = simulatedSpeedKBps || Infinity;
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
    const delay = ((bytes / this.simulatedSpeedKBps) * 1000) / 1024;

    if (this.fileSize > 0) {
      this.simulatedSpeedKBps === Infinity
        ? this._pushBytes(bytes)
        : setTimeout(() => this._pushBytes(bytes), delay);
    } else {
      this.push(null);
    }
  }
}
