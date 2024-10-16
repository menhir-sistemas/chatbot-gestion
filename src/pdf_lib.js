const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';

const main = async () => {
  // TODO your code here
};

main()
  .catch(err => {
    // Code on error
    if (IS_TEST) {
      result.text(`[ERROR] : ${err.message}`);
    }
    bmconsole.error(`[ERROR]: ${err.message}`);
  })
  .finally( () => {
    // Code on finish
    result.done();
  });
