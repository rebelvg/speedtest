import * as FakeTimers from '@sinonjs/fake-timers';
import { assert } from 'chai';
import { Readable } from 'stream';
import { CustomWritable } from './custom-writable';

describe('CustomWritable integration test', () => {
  let clock: FakeTimers.InstalledClock;

  context('when CustomWritable simulated speed is not set', () => {
    const fileSize = 32 * 1024 * 1024;

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

      assert.isBelow(testTime, 100);
    });
  });

  context('when CustomWritable simulated speed is set', function () {
    const fileSize = 32 * 1024 * 1024;

    let startTime: Date;
    let endTime: Date;

    before(() => {
      clock = FakeTimers.install({
        toFake: ['setTimeout', 'Date'],
      });

      clock.setTickMode({ mode: 'nextAsync' });
    });

    after(() => {
      clock.uninstall();
    });

    before(async () => {
      startTime = new Date();

      const readable = Readable.from(Buffer.alloc(fileSize));

      const writable = new CustomWritable({
        fileSize,
        simulatedSpeedKbps: 128,
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

      assert.strictEqual(testTime, 2048000);
    });
  });
});
