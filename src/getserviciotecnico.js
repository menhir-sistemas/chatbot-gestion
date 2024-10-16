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
        uri: `${URI}/warranty/cardif/getServicioTecnico?cp=${context.userData.variables.cp}&codigo_localidad=${context.userData.variables.codigoLocalidad}&sublinea_producto=${context.userData.variables.sublineaProducto}`,
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
    if (response.data && Array.isArray(response.data.ServicioTecnico)) {
      	let buttons = result.buttonsBuilder().text('Selecciona un servicio técnico:');

      for(let i = 0;i < response.data.ServicioTecnico.length; i++){
        	buttons.addClientActionButton((i+1)+". "+response.data.ServicioTecnico[i].nombreDeServicioTecnico, 'mostrarDatosSsTecnico', {
                'valueSelected': i,
            });
      	}
      buttons.quickReplies();
      buttons.send();
      user.set('servicios', JSON.stringify(response.data.ServicioTecnico));
    }
    else {
      if (response.data && typeof response.data === 'object'){
            let ss_tecnico = `Los datos asociados al servicio técnico son los siguientes:
            Nombre: ${response.data.ServicioTecnico.nombreDeServicioTecnico}
            Dirección:${response.data.ServicioTecnico.direccion}
            Horario de atención:${response.data.ServicioTecnico.horarioDeAtencion}
            Email: ${response.data.ServicioTecnico.email}
            Teléfono: ${response.data.ServicioTecnico.telefono}
            Te recordamos que tenés 5 días hábiles para comunicarte y llevar tu producto al Servicio Técnico, de lo contrario esta Orden de Trabajo (OT) se dará de baja y tendrás que generar una nueva.`
        	user.set('codigo_sstecnico', response.data.ServicioTecnico.codigoServicio);
            user.set('datos_sstecnico', ss_tecnico);
        	result.gotoRule('st asignado');
      }
      else{
        result.gotoRule('pendiente asignacion');
      }
    }
};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  ${err.message}`;
        bmconsole.log(errorMessage);
        bmconsole.log(context.userData.variables.sublineaProducto);
        bmconsole.log(response);
  		user.set('CA_name','getServicioTecnico')
  		user.set('descripcion',`error: ${err.message}\n ${JSON.stringify(response)}`)
        result.gotoRule('Hablar con Agente');
    })
    .finally(result.done);