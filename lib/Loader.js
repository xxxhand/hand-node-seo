const fs = require('fs');

class Loader {
    withFile(fileSample) {
        this.htmlBuffer = fs.readFileSync(fileSample);
        return this;
    }
    toString() {
        if (!this.htmlBuffer) {
            return '';
        }
        return this.htmlBuffer.toString('utf-8');
    }
};

module.exports = Loader;