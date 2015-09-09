## loggero

> Lightweight stream based logger


## Examples

A few examples can be found [here](https://github.com/MiguelCastillo/loggero/tree/master/examples).


## API

> Logger comes with a default logger instance called `global`.

### create(name, options)

Factory method to create loggers with a particular name. Options are

1. **enabled** [boolean] - Flag to create the logger in a enabled/disabled state. *Default - true*.
2. **stream** [WritableStream] - Stream to write messages to.  If a stream isn't provided, the global logger's stream will be used, which defaults to console. *Default - undefined*.
3. **level** [levels] - Minimum level for messages to be logged. If a level isn't provided, the global logger's level will be used, which defaults to `info`. *Default - undefined*.

``` javascript
var loggero = require('loggero');

var logger = loggero.create('OhWoW', {
  enabled: false,
  level: loggero.levels.warn
});
```

### levels

`levels` are enums that represent a threshold for logging messages. Meaning, that only messages of equal or higher level will be logged. The lowest level is `info` and the highest level is `error`. If custom levels are used, they will follow the same processing logic for determing if a particular message should be logged. For custom levels, you will need to specfy values higher than `error` which is 3.

The different values are

1. `info` - alias `log`.
2. `warn`.
3. `error`.

The following example we configure the `global` logger to log warnings and errors.  Also a few messages are logged to illustrate the logging interface.

```
var logger = require('loggero');

logger
  .level(logger.levels.warn)
  .log('Message 1')
  .warn('Warning 1')
  .error('Error 1');
```

### find(name)

Method to find a logger by name.

In the example below, we search for the logger called `OhWoW`, configure its logging level, and log a few messages.

```
var logger = require('loggero');

logger
  .find('OhWoW')
  .level(logger.levels.info)
  .log('Message 1')
  .warn('Warning 1')
  .error('Error 1');
```

### pipe(stream)

Method to setup the stream the logger writes to. Currently, a logger can only have one stream.

The example below shows how the default `global` logger is piped to `JSONStream`, and then piped to `process.stdout`. The output format is [JSONLines](http://jsonlines.org/).

```
var JSONStream = require('JSONStream');
var logger = require('loggero');

logger
  .pipe(JSONStream.stringify(false))
  .pipe(process.stdout);

logger
  .warn('A warning', 'cup cakes are low')
  .error('An error', 'cup cakes ran out', 'buy more')
  .log('message 12');
```

### write(level, data)

Generic method to log messages. Call this if you are looking to write messages with a custom level. This method is what logger uses internally to log messages, warnings, and errors.


### log(message, ...)

Method to log `info` messages.


### info(message, ...)

Alias for the `log` method.  Use whichever is more suitable for your taste.


### warn(message, ...)

Method to log warnings.


### error(message, ...)

Method to log errors.


### enable()

Method to enable message logging.


### disable()

Method to disable messages logging.


### only()

Method to quickly disable ALL logger but the logger `only()` was called on. Only one logger can be set to `only`.  If one is already set to `only`, the call is a noop.


### all()

Method that removes the `only` filter.


### enableAll()

Method to enable all loggers; global `enable`.  When this is called, all logger will log. `only` and `level` will still determine whether or not a logger instance can actually log a message.


### disableAll()

This disables the global enable flag. If this is called, then no logger will be able to log messages of any kind.


### level(level)

Minimum level a message must have in order to be logged.  For example, if the current level is `warn`, the only `warn` and `error` will be logged. Please see [levels](#levels) for the list of values.


## Licensed under MIT
