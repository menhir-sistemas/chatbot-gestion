let utils = require('utils');

async function checkDate1(fecha) {


  // Verificar si es fin de semana (Sábado o Domingo) o si está fuera del horario de 9 a 21 hs
  var diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  var horaLocal = new Date();
  var horaArgentina = new Date(horaLocal.getTime() - (3 * 60 * 60 * 1000));
  var horaActual = horaArgentina.getHours();
  if ((diaSemana === 0 || diaSemana === 6) || horaActual < 8 || horaActual >= 19) {
    // Mensaje si está fuera del horario de atención
    //result.text("Te informamos que nuestro horario de atención es días hábiles de Lunes a Viernes de 9 a 21 hs. Te pedimos que vuelvas a escribirnos dentro de ese horario así podemos ayudarte.");
    return false;
  }

}

async function checkDate() {
  let ahora = moment();
  // Chequeo si es feriado
  if (await utils.isFeriado(ahora)) {
    // Mensaje si es feriado
    user.set('mensajeAtencion', `¡Hoy es feriado en Argentina, esperamos que estés descansando!.
        Te pedimos que vuelvas a escribirnos el próximo día hábil de lunes a viernes de 8 a 19 hs. así podemos ayudarte. Gracias`);
    return false;
  }

  // Chequeo el horario y el día de la semana
  if (ahora.day() == 0 || ahora.day() == 6 || ahora.hour() < 8 || ahora.hour() > 19) {
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
