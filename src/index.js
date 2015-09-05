var consoleStream = require('./consoleStream');
var levels = require('./levels');

var _only, _enableAll;
var _loggers = {};


/**
 * @class
 * Logger instance with a name
 *
 * @param {string} name - Name of the logger
 */
function Logger(name, options) {
  options = options || {};

  if (!options.hasOwnProperty('enabled')) {
    options.enabled = this.defaultEnabled;
  }

  this.name     = name;
  this._enabled = options.enabled;
  this._stream  = options.stream || consoleStream;
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
 * Global flag to define if loggers should be created enabled/disabled
 * by default. This value is only used if `enabled` isn't specified in
 * the options when creating a logger.
 *
 * Default value is false.
 */
Logger.prototype.defaultEnabled = false;


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
    this._stream.write(createPayload(this.name, level, data));
  }

  return this;
};


/**
 * Create the logger method for each level.
 */
Object.keys(levels).forEach(function(level) {
  Logger.prototype[level] = function() {
    return this.write(levels[level], arguments);
  };
});


/**
 * Checks if the logger can write messages.
 *
 * @returns {boolean}
 */
Logger.prototype.isEnabled = function(level) {
  return (
      (_enableAll || this._enabled) &&
      (this._level <= level) &&
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
  _enableAll = true;
  return this;
};


/**
 * Disables loggers globally.
 */
Logger.prototype.disableAll = function() {
  _enableAll = false;
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
