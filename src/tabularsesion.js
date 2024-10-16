//@constant('Use external service URI')
const URI = 'https://service01.cat-technologies.com:4484/api';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'POST';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = `bearer`

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;

const tabular = (TOKEN,data) => {
    return rp({
        method: 'POST',
        uri: `${URI}/botmaker/tabularCierre`,
        json: true,
        body:data,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'auth-token' : `${TOKEN}`
        },
    });
}

function convertirFechaArgentina(fechaString) {
  // Convierte la cadena de fecha a un objeto Date en UTC
  const fechaUTC = new Date(fechaString);

  // Obtiene el desplazamiento horario en minutos para Argentina (UTC-3)
  const offsetArgentina = -3 * 60;

  // Calcula el desplazamiento horario en milisegundos
  const offsetMillis = offsetArgentina * 60 * 1000;

  // Crea un nuevo objeto Date con el desplazamiento horario aplicado
  const fechaArgentina = new Date(fechaUTC.getTime() + offsetMillis);

  return fechaArgentina;
}

const main = async () => {
   
  if (user.get('tipoCierre') === 'abandoned'){
    return;
  }
  let tabulacion = {
    fecha_inicio :convertirFechaArgentina(context.message.SESSION_CREATION_TIME),
    fecha_fin :convertirFechaArgentina(new Date().toString()),
    session_id: context.userData._id_+'_'+context.message.SESSION_CREATION_TIME,
    tipo_cierre: user.get('tipoCierre'),
    fue_derivado:user.get('fueDerivado'),
    bot_description: 'cardif'
  }
  user.set('fecha_hora_inicio',context.message.SESSION_CREATION_TIME)
  user.set('fecha_hora_fin',new Date().toString())
  user.set('id_sesion',context.userData._id_+'_'+context.message.SESSION_CREATION_TIME)
  //await tabular(user.get('token'),tabulacion);


};

main()
    .catch(err => {
        // Code on error
        const errorMessage = `[CA_NAME] Error ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);
