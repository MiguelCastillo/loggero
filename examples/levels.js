var JSONStream = require('JSONStream');
var logger = require('logguero');

logger
  .pipe(JSONStream.stringify(false))
  .pipe(process.stdout);

// Log messages that are at least a warning.  E.g. warnings and errors.
logger
  .level(logger.levels.warn)
  .warn('A warning', 'cup cakes are low')
  .error('An error', 'cup cakes ran out', 'buy more')
  .log('message 12', 'should NOT be visible');

// Log all messages. E.g. info, warnings, and errors
logger
  .level(logger.levels.warn)
  .warn('A warning', 'cup cakes are low')
  .error('An error', 'cup cakes ran out', 'buy more')
  .level(logger.levels.info)
  .log('message 12', 'Alright, we got cupcakes', 'we are back online');
