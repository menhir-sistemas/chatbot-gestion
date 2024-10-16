//@constant('Use external service URI')
const URI = 'https://service01.cat-technologies.com:4484/api';

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

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/crm/cardif/getDatosSiniestro?segment_id=${context.userData.variables.id_contacto}`,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "auth-token": AUTHENTICATION,
        },
    });
}

function filtrarPorRango(siniestros) {
  // Obtener la fecha actual
  const hoy = new Date();

  // Calcular la fecha límite (60 días a partir de hoy)
  const limite = new Date();
  limite.setDate(hoy.getDate() - 60);

  // Filtrar los objetos dentro del rango de fechas
  const siniestrosfiltrados = siniestros.filter(siniestro => {
    // Convertir la cadena de fechaEvaluacion a objeto Date
    const fechaEvaluacion = new Date(siniestro.bfs_claimobjectiondate);

    // Verificar si la fecha está dentro del rango
    return fechaEvaluacion <= hoy && fechaEvaluacion >= limite;
  });

  return siniestrosfiltrados;
}

const main = async() => {
    const response = await callServiceApiRest();
    let _siniestros = filtrarPorRango(response["value"]);
  	user.set('q_siniestros', _siniestros.length);
  
    if (_siniestros.length > 0){
      result.text('Listado de siniestros en curso.')
      let buttons = result.buttonsBuilder().text('Seleccioná el número de siniestro por el que quieras consultar:');
      let siniestros = [];
      for(let i = 0;i < _siniestros.length; i++){

        buttons.addClientActionButton(_siniestros[i].bfs_idsiniestro, 'mostrarEstadoSiniestro', {
                'valueSelected': _siniestros[i].bfs_idsiniestro,
            });
      }
      buttons.addClientActionButton('Ninguno de los anteriores', 'mostrarEstadoSiniestro', {
                'valueSelected': 'ninguno',
            });
      buttons.quickReplies();
      buttons.send();
      user.set('siniestros', JSON.stringify(_siniestros));
    }else{
      result.text('No se encontró ningun siniestro en curso asociado al documento.')
      //result.text('Si no ves el siniestro por el que querés consultar, podés comunicarte directamente con uno de nuestros agentes.')
      result.gotoRule('Hablar con Agente')
    }
};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  ${err.message}`;
        bmconsole.log(errorMessage);
        bmconsole.log(context.userData.variables.id_contacto);
  		user.set('CA_name','getSiniestros')
  		user.set('descripcion',`error: ${err.message}\n ${JSON.stringify(response)}`)
        result.gotoRule('Hablar con Agente');
    })
    .finally(result.done);


