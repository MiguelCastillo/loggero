var JSONStream = require('JSONStream');
var logger = require('logguero');

logger
  .warn('A warning', 'cup cakes are low')
  .error('An error', 'cup cakes ran out', 'buy more')
  .log('message 12');