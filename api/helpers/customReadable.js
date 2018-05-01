const {Readable} = require('stream');

class CustomReadable extends Readable {
    constructor(options = {}) {
        const {fileSize = 0, simulatedSpeed = Infinity} = options;

        super();

        this.fileSize = fileSize;
        this.simulatedSpeed = simulatedSpeed;
    }

    _read(bytes) {
        if (this.fileSize > 0) {
            setTimeout(() => {
                if (bytes > this.fileSize) {
                    this.push(Buffer.alloc(this.fileSize, 0x00));
                } else {
                    this.push(Buffer.alloc(bytes, 0x00));
                }

                this.fileSize -= bytes;
            }, 1000 / this.simulatedSpeed * bytes / 1024);
        } else {
            this.push(null);
        }
    };
}

module.exports = CustomReadable;
