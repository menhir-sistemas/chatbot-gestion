//@constant('Use external service URI')
const URI = 'https://service01.cat-technologies.com:4484/api';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA1MDA0NDgxfQ.Oafh2Xya6lIV8hlw1haYqDj_jVHneMkDVezN5Y-EGd4'

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/warranty/cardif/getGarantias?nro_documento=${context.userData.variables.documento}&tipo_documento=0`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "auth-token": AUTHENTICATION,
        },
    });
}

const main = async() => {
    let response = await callServiceApiRest();
    bmconsole.log(response);
  	//seteamos la cantidad de garantias obtenidas
    response = JSON.parse(response);
    if (response && response.garantiasCliente.length > 0){
        user.set('q_garantias', response.garantiasCliente.length)
      	result.text(`Este es el listado de garantías extendidas que coinciden con tus datos.`);
      let buttons = result.buttonsBuilder().text('');
      let garantias = [];
      for(let i = 0;i < response.garantiasCliente.length; i++){
        buttons.addClientActionButton(response.garantiasCliente[i], 'mostrarEstadoGarantia', {
        	'valueSelected': i,
        });
      }
      buttons.addClientActionButton('Ninguna de las anteriores', 'mostrarEstadoGarantia', {
            'valueSelected': 'ninguno',
      });
      buttons.quickReplies();
      buttons.send();
      user.set('garantias', JSON.stringify(response.data))
    }
    else{
      user.set('CA_name','getGarantias')
  	  user.set('descripcion',`error: ${response.errores? response.errores.MensajeError.mensajeError : JSON.stringify(response)}\n`)
      result.gotoRule('Hablar con Agente');
    }
    //response = JSON.parse(response);
    //result.text(JSON.stringify(response, null, 2))
    
};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  ${err.message}`;
        bmconsole.log(errorMessage);
        bmconsole.log(context.userData.variables.documento);
        bmconsole.log(response);
        user.set('CA_name','getGarantias')
  		user.set('descripcion',`error: ${err.message}\n ${JSON.stringify(response)}`)
        result.gotoRule('Hablar con Agente');
    })
    .finally(result.done);