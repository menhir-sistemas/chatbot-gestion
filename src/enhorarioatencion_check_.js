let utils = require('utils');

async function checkDate() {
  let ahora = moment();
  // Chequeo si es feriado
  let feriado = await utils.isFeriado(ahora);
  if (feriado) {
    if (feriado.tipo == 'custom') {
      user.set('mensajeAtencion', `Te informamos que, con motivo de ${feriado.nombre}, no estaremos atendiendo.
        Te pedimos que vuelvas a escribirnos el próximo día hábil de lunes a viernes de 8 a 19 hs. así podremos ayudarte. Gracias`);

    } else {
      // Mensaje si es feriado
      user.set('mensajeAtencion', `¡Hoy es feriado en Argentina, esperamos que estés descansando!.
        Te pedimos que vuelvas a escribirnos el próximo día hábil de lunes a viernes de 8 a 19 hs. así podremos ayudarte. Gracias`);
    }
    return false;
  }

  // Chequeo el horario y el día de la semana
  if (ahora.day() == 0 || ahora.day() == 6 || ahora.hour() < 8 || ahora.hour() >= 19) {
    user.set('mensajeAtencion', "Te informamos que nuestro horario de atención de lunes a viernes de 8 a 19 hs. Te pedimos que vuelvas a escribirnos dentro de ese horario así podemos ayudarte.");
    return false;
  }
  // Mensaje si está dentro del horario de atención y no es feriado
  return true;
}

const main = async () => {
  try {
    const enAtencion = await checkDate();
    user.set('enAtencion', enAtencion);
  } catch (error) {
    user.set('enAtencion', true);
  }
  user.set('tiempo_atencion', context.message.SESSION_CREATION_TIME)
};

main()
  .catch(err => {
    const errorMessage = `[CA_NAME] Error ${err.message}`;
    user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
    bmconsole.log(errorMessage); // Log Error
  })
  .finally(result.done);
