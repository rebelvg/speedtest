const {Writable} = require('stream');

class CustomWritable extends Writable {
    constructor(options = {}) {
        const {fileSize = 0, simulatedSpeed = Infinity} = options;

        super();

        this.fileSize = fileSize;
        this.simulatedSpeed = simulatedSpeed;
    }

    _write(chunk, encoding, callback) {
        if (this.fileSize > 0) {
            setTimeout(callback, 1000 / this.simulatedSpeed * chunk.length / 1024);

            this.fileSize -= chunk.length;
        } else {
            callback(new Error('Enough.'));
        }
    }
}

module.exports = CustomWritable;
