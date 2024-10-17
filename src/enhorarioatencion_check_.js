const getFeriados = async (year) => {

  return await rp({
    method: 'GET',
    uri: `https://api.argentinadatos.com/v1/feriados/${year}`,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
}

async function checkDate(fecha) {
  // Verificar si es fin de semana (Sábado o Domingo) o si está fuera del horario de 9 a 21 hs
  var diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  var horaLocal = new Date();
  var horaArgentina = new Date(horaLocal.getTime() - (3 * 60 * 60 * 1000));
  var horaActual = horaArgentina.getHours();
  if ((diaSemana === 0 || diaSemana === 6) || horaActual < 8 || horaActual >= 19) {
    // Mensaje si está fuera del horario de atención
    //result.text("Te informamos que nuestro horario de atención es días hábiles de Lunes a Viernes de 9 a 21 hs. Te pedimos que vuelvas a escribirnos dentro de ese horario así podemos ayudarte.");
    user.set('mensajeAtencion', "Te informamos que nuestro horario de atención de lunes a viernes de 8 a 19 hs. Te pedimos que vuelvas a escribirnos dentro de ese horario así podemos ayudarte.");
    return false;
  }

  // Obtener información sobre feriados en Argentina para el año actual
  try {
    let feriados = await getFeriados(fecha.getFullYear());
    // Verificar si la fecha actual es un feriado
    var esFeriado = feriados.some(feriado => {
      var fechaFeriado = new Date(feriado.fecha + " 03:00:00");
      return fechaFeriado.toDateString() === fechaActual.toDateString();
    });

    if (esFeriado) {
      // Mensaje si es feriado
      /*result.text(`¡Hoy es feriado en Argentina, esperamos que estés descansando!.
      Te pedimos que vuelvas a escribirnos el próximo día hábil de lunes a viernes de 9 a 21 así podemos ayudarte. Gracias`);*/
      user.set('mensajeAtencion', `¡Hoy es feriado en Argentina, esperamos que estés descansando!.
      Te pedimos que vuelvas a escribirnos el próximo día hábil de lunes a viernes de 8 a 19 hs. así podemos ayudarte. Gracias`);
      return false;

    }
    // Mensaje si está dentro del horario de atención y no es feriado
    return true;
  } catch (error) {
    bmconsole.log("Error al obtener información sobre feriados:", error);
    return true; // Se asume que no es feriado si hay un error en la obtención de datos
  }
}

const main = async () => {
  fechaActual = new Date();
  bmconsole.log(fechaActual);
  bmconsole.log(context.userData.PLATFORM_CONTACT_ID);
  const enAtencion = await checkDate(fechaActual);
  user.set('enAtencion', enAtencion);
  user.set('tiempo_atencion', context.message.SESSION_CREATION_TIME)
};



main()
  .catch(err => {
    const errorMessage = `[CA_NAME] Error ${err.message}`;
    user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
    bmconsole.log(errorMessage); // Log Error
  })
  .finally(result.done);
