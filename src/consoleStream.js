var levels = require('./levels');
var result;

if (typeof(console) !== 'undefined') {
  result = console;
}

function write(data) {
  if (result) {
    switch(data.level) {
      case levels.log:
        result.log(data);
        break;
      case levels.info:
        result.log(data);
        break;
      case levels.warn:
        result.warn(data);
        break;
      case levels.error:
        result.error(data);
        break;
    }
  }
}

function pipe(stream) {
  return stream;
}

/**
 * Returns a valid console interface with three methods:
 *
 * @returns {{write: function}}
 */
module.exports = {
  write: write,
  pipe: pipe
};
