const stream = require("stream");
class videoStream extends stream.Duplex {
  constructor() {
    super();
  }
  _write(chunk, encoding, callback) {
    console.log("source: " + chunk.toString());
    if (!this.isPaused()) this.push(chunk);
    callback();
  }
  _read() {}
}
module.exports = videoStream;
