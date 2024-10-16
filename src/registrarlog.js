const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
//@constant('Use external service URI')
const URI = 'https://service01.cat-technologies.com:4484/api';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'POST';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = `bearer`

const logear = (TOKEN,data) => {
  return rp({
      method: 'POST',
      uri: `${URI}/botmaker/logear`,
      json: true,
      body:data,
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'auth-token' : `${TOKEN}`
      },
  });
}

const main = async () => {
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA1MDA0NDgxfQ.Oafh2Xya6lIV8hlw1haYqDj_jVHneMkDVezN5Y-EGd4';
  let data = {
    fecha_hora: new Date(),
    accion_de_codigo: user.get('CA_name'),
    bot_description: 'cardif',
    status: 'error',
    descripcion: user.get('descripcion'),
    session_id: context.userData._id_+context.message.SESSION_CREATION_TIME,
  }
  await logear(token,data);
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
