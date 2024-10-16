//@constant('Use external service URI')
const URI = 'https://service01.cat-technologies.com:4484/api';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA1MDA0NDgxfQ.Oafh2Xya6lIV8hlw1haYqDj_jVHneMkDVezN5Y-EGd4'

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'certificados'

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/warranty/cardif/getCertificadosByDNI?tipo_documento=0&nro_documento=${user.get('documento')}`,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "auth-token": AUTHENTICATION,
        },
    });
}

const main = async() => {
    bmconsole.log(user.get('documento'))
    const response = await callServiceApiRest();

  if (typeof response.data === 'string'){
      	context.userData.variables.es_contacto = false;
      	
    }else{
        context.userData.variables.es_contacto = true;
        let nombre_ok = '',apellido_ok = '';
        //buscamos el nombre, tiene que ser distinto de "" y el string "no informado"
        for(let c=0;c<response.data.length;c++){
          let certificado = response.data[c];
          if (nombre_ok === '' && (certificado.nombre_cliente && certificado.nombre_cliente != "" && certificado.nombre_cliente.toLowerCase().trim() !== 'no informado' && certificado.nombre_cliente.toLowerCase().trim() !== 'sin nombre')){
          	nombre_ok = certificado.nombre_cliente;
          }
          if (apellido_ok === '' && (certificado.apellido_cliente && certificado.apellido_cliente != "" && certificado.apellido_cliente.toLowerCase().trim() !== 'no informado' && certificado.apellido_cliente.toLowerCase().trim() !== 'sin apellido')){
          	apellido_ok = certificado.apellido_cliente;
          }
        }
        user.set('nombre',nombre_ok)
        user.set('apellido',apellido_ok)
        bmconsole.log(user.get('nombre'))
        bmconsole.log(user.get('apellido'))
    }
};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :   ${err.message}`;
        bmconsole.log(errorMessage);
        bmconsole.log(context.userData.variables.documento);
  		user.set('CA_name','identificarUsuario')
  		user.set('descripcion',`error: ${err.message}\n ${JSON.stringify(response)}`)
        result.gotoRule('asignar a agente');
        
    })
    .finally(result.done);