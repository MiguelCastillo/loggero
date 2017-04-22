var levels = require('./levels');
var dest = typeof(console) !== 'undefined' ? console : false;

function write(data) {
  if (!dest) {
    return;
  }

  switch(data.level) {
    case levels.log:
      dest.log(data);
      break;
    case levels.info:
      dest.log(data);
      break;
    case levels.warn:
      dest.warn(data);
      break;
    case levels.error:
      dest.error(data);
      break;
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
