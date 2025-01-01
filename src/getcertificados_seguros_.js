//@constant('Use external service URI')
//const URI = 'https://service01.cat-technologies.com:4484/api';

let utils = require('utils');

const URI = utils.crmURL();


//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA1MDA0NDgxfQ.Oafh2Xya6lIV8hlw1haYqDj_jVHneMkDVezN5Y-EGd4'

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'siniestros'

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';

const OUTPUTS = {
  log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const es_vigente = (estado) => {
  estado = estado.trim().toLowerCase();
  if (estado === 'vigente' || estado === 'vigente pendiente de impresión') {
    return true;
  }
  return false;
}

const callServiceApiRest = () => {
  return rp({
    method: METHOD,
    uri: `${URI}/crm/cardif/getCertificados?segment_id=${context.userData.variables.id_contacto}`,
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

  if (response["value"].length > 0) {

    let certificados = [];
    for (let i = 0; i < response["value"].length; i++) {
      let estado = es_vigente(response["value"][i].bfs_estado);
      if (estado && (!response["value"][i].bfs_certificado.includes('-'))) {
        certificados.push(response["value"][i]);
      }
    }
    user.set('q_certificados', certificados.length);
    if (certificados.length === 0) {
      result.gotoRule('Hablar con Agente')
      return;
    }
    let buttons = result.buttonsBuilder().text('Selecciona el seguro que queres conocer:');

    for (let i = 0; i < certificados.length; i++) {
      let nombre_certificado = certificados[i].bnp_desc_prod_mkt ? `${certificados[i].bfs_certificado} - ${certificados[i].bnp_desc_prod_mkt}` : `${certificados[i].bfs_certificado}`;
      buttons.addClientActionButton(nombre_certificado, 'mostrarDatosCertificado', {
        'valueSelected': certificados[i].bfs_certificado,
      });
    }
    buttons.addClientActionButton('Ninguno de los anteriores', 'mostrarDatosCertificado', {
      'valueSelected': 'ninguno',
    });
    buttons.quickReplies();
    buttons.send();
    user.set('certificados', JSON.stringify(certificados));
  } else {
    result.gotoRule('Hablar con Agente')
  }
};

main()
  .catch((err) => {
    // Code on error
    const errorMessage = `[Integration with api rest] :  ${err.message}`;
    bmconsole.log(errorMessage);
    bmconsole.log(context.userData.variables.id_contacto);
    user.set('CA_name', 'getCertificados(Seguros)')
    //user.set('descripcion', `error: ${err.message}\n ${JSON.stringify(response)}`)
    result.gotoRule('Hablar con Agente');
  })
  .finally(result.done);