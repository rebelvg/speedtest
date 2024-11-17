import { assert } from 'chai';
import { Readable } from 'stream';
import { CustomWritable } from './custom-writable';

describe('CustomWritable integration test', () => {
  context('when CustomWritable simulated speed is not set', () => {
    const fileSize = 30 * 1024 * 1024;

    let startTime: Date;
    let endTime: Date;

    before(async () => {
      startTime = new Date();

      const readable = Readable.from(Buffer.alloc(fileSize));

      const writable = new CustomWritable({
        fileSize,
      });

      readable.pipe(writable);

      await new Promise((resolve, reject) => {
        writable.on('error', reject);

        writable.on('finish', resolve);
      });

      endTime = new Date();
    });

    it('should write as expected', () => {
      const testTime = endTime.valueOf() - startTime.valueOf();

      assert.isBelow(testTime, 1 * 1000);
    });
  });

  context('when CustomWritable simulated speed is set', function () {
    const timeout = 10 * 1000;

    this.timeout(timeout);

    const fileSize = 1 * 1024 * 1024;

    let startTime: Date;
    let endTime: Date;

    before(async () => {
      startTime = new Date();

      const readable = Readable.from(Buffer.alloc(fileSize));

      const writable = new CustomWritable({
        fileSize,
        simulatedSpeedKBps: 128,
      });

      readable.pipe(writable);

      await new Promise((resolve, reject) => {
        writable.on('error', reject);

        writable.on('finish', resolve);
      });

      endTime = new Date();
    });

    it('should write as expected', () => {
      const testTime = endTime.valueOf() - startTime.valueOf();

      assert.isAbove(testTime, 7 * 1000);
      assert.isBelow(testTime, 10 * 1000);
    });
  });
});
