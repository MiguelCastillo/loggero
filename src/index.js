var _only;
var _loggers = {};
var levels = { log: 1, info: 1, warn: 2, error: 3 };


/**
 * @class
 * Logger instance with a name
 *
 * @param {string} name - Name of the logger
 */
function Logger(name, options) {
  options = options || {};

  if (!options.hasOwnProperty('enabled')) {
    options.enabled = true;
  }

  this.name     = name;
  this._enabled = options.enabled;
  this._stream  = options.stream || getConsoleStream();
  this._level   = options.level || levels.log;

  // Cache it so that we can find it.
  _loggers[name] = this;
}


/**
 * Expose levels to allow the customization of the values if need be.
 * Don't expect this to be a common use case.
 */
Logger.prototype.levels = levels;


/**
 * Helper factory method to create named loggers
 *
 * @returns {Logger} New logger instance
 */
Logger.prototype.create = function(name, options) {
  if (_loggers[name]) {
    return _loggers[name];
  }

  return new Logger(name, options);
};


/**
 * Method to find a logger instance by name.
 *
 * @param {string} name - Name of the logger to find
 *
 * @returns {Logger}
 */
Logger.prototype.find = function(name) {
  return _loggers[name];
};


/**
 * Method to replace the current stream with a new one.
 *
 * @param {Stream} stream - Stream to write data to
 *
 * @returns {Stream} stream passed in
 */
Logger.prototype.pipe = function(stream) {
  if (stream !== this._stream) {
    this._stream = stream;
  }

  return stream;
};


/**
 * Method that returns the current stream.
 *
 * @returns {Stream}
 */
Logger.prototype.stream = function() {
  return this._stream || _global._stream;
};


/**
 * Log a message with a custom `level`
 */
Logger.prototype.logData = function(level, data) {
  level = level || levels.info;
  if (this.isEnabled(level)) {
    this.stream().write(createPayload(this.name, level, data));
  }

  return this;
};


/**
 * Create the logger method for each level.
 */
Object.keys(levels).forEach(function(level) {
  Logger.prototype[level] = function() {
    return this.logData(levels[level], arguments);
  };
});


/**
 * Checks if the logger can write messages.
 *
 * @returns {boolean}
 */
Logger.prototype.isEnabled = function(level) {
  if (!_global._enabled) {
    return false;
  }

  return (
      (this._enabled) &&
      (_global._level <= level || this._level <= level) &&
      (!_only || _only === this)
    );
};


/**
 * Method to enable the logger intance. If loggers have been disabled
 * globally then this flag will not have an immediate effect, until
 * loggers are globally enabled.
 */
Logger.prototype.enable = function() {
  this._enabled = true;
  return this;
};


/**
 * Method to disable the logger instance. Like {@link Logger#enable},
 * this setting does not have an immediate effect if loggers are globally
 * disabled.
 */
Logger.prototype.disable = function() {
  this._enabled = false;
  return this;
};


/**
 * Method to make sure *only* this logger logs messages. If another logger
 * is set to only, then the request is silently ignored.
 */
Logger.prototype.only = function() {
  if (!_only) {
    _only = this;
  }
  return this;
};


/**
 * Method to remove the logger from the `only` state to allow other loggers
 * set themselves as only.
 */
Logger.prototype.all = function() {
  _only = null;
  return this;
};


/**
 * Enables loggers globally.
 */
Logger.prototype.enableAll = function() {
  _global._enabled = true;
  return this;
};


/**
 * Disables loggers globally.
 */
Logger.prototype.disableAll = function() {
  _global._enabled = false;
  return this;
};


/**
 * Sets the logging level
 */
Logger.prototype.level = function(level) {
  this._level = level;
  return this;
};


/**
 * Function that create a JSON structure to be logged
 *
 * @param {string} name - Name of the logger
 * @param {int} level - Logging level. E.g. log, warn, error
 * @param {object} data - application data to be logged
 *
 * @returns {{date: Date, level: int, name: string, data: object}}
 *  Meta data to be logged
 */
function createPayload(name, level, data) {
  return {
    date: getDate(),
    level: level,
    name: name,
    data: data
  };
}


/**
 * Returns a valid console interface with three methods:
 *
 * @returns {{write: function}}
 */
function getConsoleStream() {
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

  return {
    write: write,
    pipe: pipe
  };
}


/**
 * Helper method to get timestamps for logged message
 *
 * @private
 */
function getDate() {
  return (new Date()).getTime();
}


/**
 * Default logger instance available
 */
var _global = new Logger('global');

module.exports = Logger.prototype.default = _global;
