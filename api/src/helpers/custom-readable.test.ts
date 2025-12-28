import * as FakeTimers from '@sinonjs/fake-timers';
import { assert } from 'chai';
import { Writable } from 'stream';
import { CustomReadable } from './custom-readable';

describe('CustomReadable integration test', () => {
  let clock: FakeTimers.InstalledClock;

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
    const fileSize = 32 * 1024 * 1024;

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

      assert.isBelow(testTime, 100);
    });
  });

  context('when CustomReadable simulated speed is set', function () {
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

      const writable = new TestWritable();

      const readable = new CustomReadable({
        fileSize,
        simulatedSpeedKbps: 128,
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

      assert.strictEqual(testTime, 2048000);
    });
  });
});
