import logger from 'dist/index';

describe('Test suite', () => {
  beforeEach(() => {
    logger.log('Logger is called');
  });

  it('pandaBear.eats returns `Bamboo and more`', false);
});
