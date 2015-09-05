## logguero

Lightweight stream based logger


## Examples

A few examples can be found [here](https://github.com/MiguelCastillo/logguero/tree/master/examples).


## API

### create(name, options)

Factory method to create loggers with a particular name.  Options are

1. **enabled** [true] - Flag to create the logger in a enabled/disabled state.
2. **stream** [console] - Stream to write messages to.  It defaults to console, if available.
3. **level** [info] - Minimum level for messages to be logged.  Defaults to `info`, so everything is logged.

### levels - Instance property

levels is a property available in all instances, which has the valid levels for enabling/disabling logging of different types of messages.

The different values are

1. `info` - alias `log`.
2. `warn`.
3. `error`.

The following example creates a logger called `OhWow` and it is configured to log warnings and errors.  Also a few messages are logged to illustrate the logging interface.

```
var logger = require('logguero').create('OhWow');

logger
  .level(logger.levels.warn)
  .log('Message 1')
  .warn('Warning 1')
  .error('Error 1');
```

### find(name)

Method to find a particular logger by name. Logger comes with a default default logger instance called `global`.

In the example below, we create a logger called `evenBetter`, and we search for the logger called `OhWoW`, configure its logging level, and log a few messages.

```
var logger = require('logguero').create('evenBetter');

logger
  .find('OhWoW')
  .level(logger.levels.info)
  .log('Message 1')
  .warn('Warning 1')
  .error('Error 1');
```

### pipe(stream)

Method to setup the stream the logger writes to.  Currently, a logger can only have one stream.

The example below shows how the default logger is piped to `JSONStream`, and then piped to `process.stdout`. The format logged is JSONLines.

```
var JSONStream = require('JSONStream');
var logger = require('logguero');

logger
  .pipe(JSONStream.stringify(false))
  .pipe(process.stdout);

logger
  .warn('A warning', 'cup cakes are low')
  .error('An error', 'cup cakes ran out', 'buy more')
  .log('message 12');
```

### logData(level, data)

Generic method to log messages. Call this if you are looking to write messages with a custom level. This method is what logger uses internally to log messages, warnings, and errors.


### log(message, ...)

Method to log messages to the configured stream, which by default is the console.  It takes n arguments.

### info(message, ...)

Alias for the `log` method.  Use whichever is more suitable for your taste.

### warn(message, ...)

Method to log warnings to the configured stream.

### error(message, ...)

Method to log errors to the configured stream.

### enable()

Method to enable message logging by a particular logger instance.

### disable()

Method to disable messages logging by a particular logger instance.

### only()

Method to quickly disable ALL logger but the logger `only` was called on. Only one logger can be set to `only`.  If one is already set to `only`, the call is a noop.

### all()

Method that removes the `only` filter.

### enableAll()

Method to enable all loggers; global `enable`.  When this is called, all logger will log, even if a particular logger is `disabled`, unless `only` is set. If only is set, then that has higher presedence.

### disableAll()

Method to disable all loggers; global `disable`.  When this is called, each individual logger `enabled` field will override this global value.

### level(level)

Minimum level a message must have in order to be logged.  For example, if the current level is `warn`, the only `warn` and `error` will be logged. Please see `levels` for the list of values.


## Licensed under MIT
