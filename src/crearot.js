//@constant('Use external service URI')
let utils = require('utils');

const URI = utils.warrantyURL();

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'POST';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA1MDA0NDgxfQ.Oafh2Xya6lIV8hlw1haYqDj_jVHneMkDVezN5Y-EGd4'

const callServiceApiRest = (data) => {
  return rp({
    method: METHOD,
    uri: `${URI}/warranty/cardif/crearOrdenDeTrabajo`,
    json: true,
    body: data,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "auth-token": AUTHENTICATION,
    },
  });
}

const main = async () => {
  utils.checkOutOfService();
  let nro_contacto = context.userData.CHAT_PLATFORM_ID === 'whatsapp' ? context.userData.PLATFORM_CONTACT_ID : null;
  let calle = user.get('calle') ? user.get('calle') : '-';
  let direccion = user.get('domicilio') ? user.get('domicilio').substring(0, 100) : calle.substring(0, 100);

  const data = {
    codigo_ss_tecnico: user.get('codigo_sstecnico') ? user.get('codigo_sstecnico') : 99999999,
    poliza: user.get('poliza'),
    codigo_extra_garantia: user.get('codigoExtragarantia'),
    descripcion_falla: user.get('falla_descripcion') ? user.get('falla_descripcion').substring(0, 300) : "",
    apellido: user.get('apellido') ? user.get('apellido').substring(0, 50) : "-",
    nombre: user.get('nombre') ? user.get('nombre').substring(0, 50) : "-",
    telefono_1: nro_contacto ? nro_contacto : user.get('telefono_contacto'),
    telefono_2: user.get('telefono_contacto'),
    email: user.get('email'),
    cp: user.get('cp'),
    direccion: direccion,
    nro_puerta: user.get('puerta') ? user.get('puerta') : "",
    codigo_localidad: user.get('codigoLocalidad'),
    codigo_provincia: user.get('codigoProvincia'),
    tipo_documento: 0,
    nro_documento: user.get('documento'),
  }

  bmconsole.log(data);
  const response = await callServiceApiRest(data);
  bmconsole.log(response);
  if (response.numeroOT && response.numeroOT != '') {
    user.set('numeroOT', response.numeroOT)
  }
  else {
    user.set('CA_name', 'crearOT')
    try {
      user.set('descripcion', `error: ${response.resultado.errors[0]}`);
    } catch (error2) {
      user.set('descripcion', `error: ${JSON.stringify(response)}`);     
    }
    result.gotoRule('Hablar con Agente');
  }
};

main()
  .catch(err => {
    // Code on error
    const errorMessage = `[Integration with api rest] :  ${err.message}`;
    bmconsole.log(errorMessage);
    bmconsole.log(data);
    bmconsole.log(response);
    user.set('CA_name', 'crearOT')
    user.set('descripcion', `error: ${err.message}\n ${JSON.stringify(response)}`)
    result.gotoRule('Hablar con Agente');
  })
  .finally(result.done);

