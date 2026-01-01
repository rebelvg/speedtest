import { Readable } from 'stream';
import { API } from '../config';

interface ICustomReadableOptions {
  fileSize: number;
  simulatedSpeedKbps?: number;
}

export class CustomReadable extends Readable {
  private fileSize: number = 0;
  private simulatedSpeedKbps: number = Infinity;

  constructor({ fileSize, simulatedSpeedKbps }: ICustomReadableOptions) {
    super({});

    this.fileSize = fileSize;

    if (simulatedSpeedKbps && API.SPEED_LIMIT) {
      this.simulatedSpeedKbps = simulatedSpeedKbps;
    }
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
      if (this.simulatedSpeedKbps === Infinity) {
        this._pushBytes(bytes);
      } else {
        const delay = ((bytes / this.simulatedSpeedKbps) * 8 * 1000) / 1024;

        setTimeout(() => this._pushBytes(bytes), delay);
      }
    } else {
      this.push(null);
    }
  }
}
