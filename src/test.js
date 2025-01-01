//@constant('Use external service URI')
//const URI = 'https://service01.cat-technologies.com:4484/api';


const URI = 'http://190.104.197.146:5000';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA1MDA0NDgxfQ.Oafh2Xya6lIV8hlw1haYqDj_jVHneMkDVezN5Y-EGd4'

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'Localidades'

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;

const OUTPUTS = {
  log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
  return rp({
    method: METHOD,
    uri: `${URI}/warranty/cardif/getLocalidadesByCP?cp=1425`,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "auth-token": AUTHENTICATION,
    },
  });
}

const main = async () => {
  const response = await callServiceApiRest();
  if (response.data) {
    if (!Array.isArray(response.data)) {
      result.text(`La localidad que coincide con el CP ingresado es *${response.data.Localidad.nombreLocalidad.toLowerCase()}*`);
      user.set('codigoLocalidad', response.data.Localidad.codigoLocalidad);
      user.set('codigoProvincia', response.data.Provincia.codigoProvincia);
    }
    else {
      if (response.data.length == 1) {
        result.text(`La localidad que coincide con el CP ingresado es *${response.data[0].Localidad.nombreLocalidad.toLowerCase()}*`);
        user.set('codigoLocalidad', response.data[0].Localidad.codigoLocalidad);
        user.set('codigoProvincia', response.data[0].Provincia.codigoProvincia); 
      } else {
        result.text(`Se encontró más de una localidad asociada con el CP ingresado`);
        let buttons = result.buttonsBuilder().text('Ingresá la opción correspondiente:');
        for (let i = 0; i < response.data.length; i++) {
          let localidad = response.data[i];
          buttons.addClientActionButton(i + ". " + localidad.Localidad.nombreLocalidad + " (" + localidad.Provincia.nombreProvincia + ")", 'elegirLocalidad', {
            'valueSelected': i,
          });
        }
      }
      buttons.addClientActionButton((response.data.length) + "." + ' Ninguna de las anteriores', 'elegirLocalidad', {
        'valueSelected': 'ninguno',
      });
      buttons.quickReplies();
      buttons.send();
      user.set(BM_RESULT_VAR_NAME, JSON.stringify(response.data))
    }
  }
  else {
    result.text("No se encontraron localidades con el código postal ingresado. Intentelo nuevamente.");
    result.gotoRule("vigente");
  }
};

main()
  .catch((err) => {
    // Code on error
    const errorMessage = `[Integration with api rest] :  ${err.message}`;
    bmconsole.log(errorMessage);
    bmconsole.log(context.userData.variables.cp);
    //bmconsole.log(response);
    user.set('CA_name', 'getLocalidadesByCP')
    //user.set('descripcion',`error: ${err.message}\n ${JSON.stringify(response)}`)
    result.gotoRule('Hablar con Agente');
  })
  .finally(result.done);

