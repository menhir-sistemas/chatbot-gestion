const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const accessTokenV2 = 'eyJhbGciOiJIUzUxMiJ9.eyJidXNpbmVzc0lkIjoiZ2VzdGlvbiIsIm5hbWUiOiJMZW9uYXJkbyBCbHVtZW5jd2VpZyIsImFwaSI6dHJ1ZSwiaWQiOiJxUUVCWnNra1RyVmQ3ZkR3QzN0SVFEN0hUb2cxIiwiZXhwIjoxODg2Njc5MzE4LCJqdGkiOiJxUUVCWnNra1RyVmQ3ZkR3QzN0SVFEN0hUb2cxIn0.6LHZiEv9-9FPWGuTh-Wk27Uodfdw_CFC9Hlfxq2C4TzF7BjTYjuzPtRXnbkNIkuc4narT8_tZ-Ne1RYQ-RYnug';
const bmApiUrl = 'https://api.botmaker.com/v2.0';


const main = async () => {
  let uri = `${bmApiUrl}/intents`;
  bmconsole.log('antes');
  
  let result = [];

  while (true) {
    let resp  = await rp({
      uri: uri,
      method: 'GET',
      json: true,
      headers: {
        'Accept': 'application/json',
        'access-token': accessTokenV2,
      }
    });
    resp.items.forEach(it => {
      result.push({
        botId: it.bot.id,
        botName: it.bot.name,
        taskId : it.id,
        taskName: it.name
      });     
    });

    uri = resp.nextPage;
    if (uri == null ) {
      return result;
    }

  
  }
};

main()
.then((x) => {
  bmconsole.log('ok1');
})  .catch(err => {
    bmconsole.error(`[ERROR]: ${err.message}`);
  })
  .finally( () => {
    result.done();
  });
