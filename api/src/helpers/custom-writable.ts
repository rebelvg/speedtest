import { Writable } from 'stream';
import { API } from '../config';

interface ICustomWritableOptions {
  fileSize: number;
  simulatedSpeedKbps?: number;
}

export class CustomWritable extends Writable {
  private fileSize: number = 0;
  private simulatedSpeedKbps: number = Infinity;

  constructor({ fileSize, simulatedSpeedKbps }: ICustomWritableOptions) {
    super({});

    this.fileSize = fileSize;

    if (simulatedSpeedKbps && API.SPEED_LIMIT) {
      this.simulatedSpeedKbps = simulatedSpeedKbps;
    }
  }

  public _write(
    chunk: Buffer,
    encoding: string,
    callback: (error?: Error) => void,
  ) {
    if (this.fileSize > 0) {
      this.fileSize -= chunk.length;

      if (this.simulatedSpeedKbps === Infinity) {
        callback();
      } else {
        const delay =
          ((chunk.length / this.simulatedSpeedKbps) * 8 * 1000) / 1024;

        setTimeout(callback, delay);
      }
    } else {
      callback(new Error('bad_data'));
    }
  }

  public _final(callback) {
    if (this.fileSize === 0) {
      callback();
    } else {
      callback(new Error('bad_data'));
    }
  }
}
