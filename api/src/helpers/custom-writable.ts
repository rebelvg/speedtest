import { Writable } from 'stream';

interface ICustomWritableOptions {
  fileSize: number;
  simulatedSpeed?: number;
}

export class CustomWritable extends Writable {
  private fileSize: number = 0;
  private simulatedSpeed: number = Infinity;

  constructor(options: ICustomWritableOptions) {
    super();

    const { fileSize, simulatedSpeed } = options;

    this.fileSize = fileSize;
    this.simulatedSpeed = simulatedSpeed || Infinity;
  }

  public _write(
    chunk: Buffer,
    encoding: string,
    callback: (error?: Error) => void,
  ) {
    if (this.fileSize > 0) {
      this.fileSize -= chunk.length;

      this.simulatedSpeed === Infinity
        ? callback()
        : setTimeout(
            callback,
            ((1000 / this.simulatedSpeed) * chunk.length) / 1024,
          );
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
