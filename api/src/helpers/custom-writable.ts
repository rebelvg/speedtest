import { Writable } from 'stream';

interface ICustomWritableOptions {
  fileSize: number;
  simulatedSpeedKBps?: number;
}

export class CustomWritable extends Writable {
  private fileSize: number = 0;
  private simulatedSpeedKBps: number = Infinity;

  constructor(options: ICustomWritableOptions) {
    super({
      highWaterMark: (options.simulatedSpeedKBps || 16) * 1024,
    });

    const { fileSize, simulatedSpeedKBps } = options;

    this.fileSize = fileSize;
    this.simulatedSpeedKBps = simulatedSpeedKBps || Infinity;
  }

  public _write(
    chunk: Buffer,
    encoding: string,
    callback: (error?: Error) => void,
  ) {
    if (this.fileSize > 0) {
      this.fileSize -= chunk.length;

      const delay = ((chunk.length / this.simulatedSpeedKBps) * 1000) / 1024;

      this.simulatedSpeedKBps === Infinity
        ? callback()
        : setTimeout(callback, delay);
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
