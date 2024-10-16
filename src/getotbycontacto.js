//@constant('Use external service URI')
const URI = 'https://service01.cat-technologies.com:4484/api';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA1MDA0NDgxfQ.Oafh2Xya6lIV8hlw1haYqDj_jVHneMkDVezN5Y-EGd4'
//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'OT'

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/warranty/cardif/getOrdenesDeTrabajo?tipo_documento=0&nro_documento=${context.userData.variables.documento}`,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "auth-token": AUTHENTICATION,
        },
    });
}

const main = async() => {
    const response = await callServiceApiRest();
    user.set('q_ot', response["otCliente"].length);
    
    if (response["otCliente"].length > 0){
      result.text('Este es el listado de las órdenes de trabajo asociadas con tu documento:')
      let buttons = result.buttonsBuilder().text('Ingresá el número de la OT por la cual querés consultar el estado:');
      let ots = [];
      for(let i = 0;i < response["otCliente"].length; i++){
        buttons.addClientActionButton(response["otCliente"][i], 'mostrarEstadoOT', {
                'valueSelected': i,
            });
      }
      buttons.addClientActionButton('Ninguno de los anteriores', 'mostrarEstadoOT', {
                'valueSelected': 'ninguno',
            });
      buttons.quickReplies();
      buttons.send();
      user.set('ots', JSON.stringify(response.data));
    }else{
      user.set('CA_name','getOTbyContacto')
      user.set('descripcion',`error: ${response.errores? response.errores.MensajeError.mensajeError : JSON.stringify(response)}\n`)
      result.gotoRule('Hablar con Agente')
    }
};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  ${err.message}`;
        bmconsole.log(errorMessage);
        bmconsole.log(response);
  		user.set('CA_name','getOTbyContacto')
  		user.set('descripcion',`error: ${err.message}\n ${JSON.stringify(response)}`)
        result.gotoRule('Hablar con Agente');
    })
    .finally(result.done);