var consoleStream = require('./consoleStream');
var levels = require('./levels');

var _only;
var _loggers = {};

var _defaults = defaults({
  enabled: true
});


/**
 * @class
 * Logger instance with a name
 *
 * @param {string} name - Name of the logger
 */
function Logger(name, options) {
  this.name     = name;
  this._enabled = _defaults(options, 'enabled');
  this._stream  = _defaults(options, 'stream');
  this._level   = _defaults(options, 'level');

  var logger = this;
  _loggers[name] = this;

  /**
   * Create the logger method for each level. Set it up in the constructor
   * to properly lock in the context.
   */
  Object.keys(levels).forEach(function(level) {
    logger[level] = function() {
      return logger.write(levels[level], arguments);
    };
  });
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
 * Log a message with a custom `level`
 */
Logger.prototype.write = function(level, data) {
  level = level || levels.info;
  if (this.isEnabled(level)) {
    (this._stream || _global._stream).write(createPayload(this.name, level, data));
  }

  return this;
};


/**
 * Checks if the logger can write messages.
 *
 * @returns {boolean}
 */
Logger.prototype.isEnabled = function(level) {
  if (!_global._enabled) {
    return false;
  }

  var enabled = this._enabled;
  var validLevel = this._level ? this._level <= level : _global._level <= level;
  var onlyTest = !_only || _only === this;

  return enabled && validLevel && onlyTest;
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
  return _global.enable();
};


/**
 * Disables loggers globally.
 */
Logger.prototype.disableAll = function() {
  return _global.disable();
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
var _global = (global.___loggero || (global.___loggero = new Logger('global', {stream: consoleStream, level: levels.info, enabled: true})));

module.exports = Logger.prototype.default = _global;


function defaults(_defaults) {
  return function read(options, name) {
    return options && options.hasOwnProperty(name) ? options[name] : _defaults[name];
  };
}
