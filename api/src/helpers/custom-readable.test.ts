import { assert } from 'chai';
import { Writable } from 'stream';
import { CustomReadable } from './custom-readable';

describe('CustomReadable integration test', () => {
  class TestWritable extends Writable {
    public _write(
      chunk: Buffer,
      encoding: string,
      callback: (error?: Error) => void,
    ) {
      callback();
    }
  }

  context('when CustomReadable simulated speed is not set', () => {
    const fileSize = 30 * 1024 * 1024;

    let startTime: Date;
    let endTime: Date;

    before(async () => {
      startTime = new Date();

      const writable = new TestWritable();

      const readable = new CustomReadable({
        fileSize,
      });

      readable.pipe(writable);

      await new Promise((resolve, reject) => {
        readable.on('error', reject);

        readable.on('end', resolve);
      });

      endTime = new Date();
    });

    it('should read as expected', () => {
      const testTime = endTime.valueOf() - startTime.valueOf();

      assert.isBelow(testTime, 1 * 1000);
    });
  });

  context('when CustomReadable simulated speed is set', function () {
    const timeout = 10 * 1000;

    this.timeout(timeout);

    const fileSize = 1 * 1024 * 1024;

    let startTime: Date;
    let endTime: Date;

    before(async () => {
      startTime = new Date();

      const writable = new TestWritable();

      const readable = new CustomReadable({
        fileSize,
        simulatedSpeed: 128,
      });

      readable.pipe(writable);

      await new Promise((resolve, reject) => {
        readable.on('error', reject);

        readable.on('end', resolve);
      });

      endTime = new Date();
    });

    it('should read as expected', () => {
      const testTime = endTime.valueOf() - startTime.valueOf();

      assert.isAbove(testTime, 7 * 1000);
      assert.isBelow(testTime, 10 * 1000);
    });
  });
});
