/**
 * Tabla de feriados adicionales
 */
feriadosAdicionales: () =>{
  return [
    {fecha: '2024-10-21', tipo: 'custom', nombre: 'Día del seguro 2024'},
    {fecha: '2024-12-24', tipo: 'custom', nombre: 'las celebraciones de las fiestas'},
    {fecha: '2024-12-31', tipo: 'custom', nombre: 'las celebraciones de las fiestas'},
  ];
},
/**
 * Carga de feriados contra un servicio externo
 * @param {*} year Año de los feriados
 * @returns 
 */
getFeriados: async (year) => {
  return await rp({
    method: 'GET',
    uri: `https://api.argentinadatos.com/v1/feriados/${year}`,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
},
isFeriado: async (cuando) => {
  // Traigo los feriados desde el servicio
  let feriados = await utils.getFeriados(cuando.year());

  // Hago el merge con los feriados adicionales
  feriados = feriados.concat(utils.feriadosAdicionales());

  const found = feriados.find( (f) =>     f.fecha == cuando.format('YYYY-MM-DD')  );

  return found;
},
isProduction: () => {
  try {
    const PRODUCTION_NUMBER = "54911287389601"; 
    let number = context.userData.CHAT_CHANNEL_ID;
    return number.includes(PRODUCTION_NUMBER);
      // TODO: solo para WA
  } catch (error) {
    bmconsole.error(error);
    return false;
  } 
},
warrantyURL: () => {
  if ( utils.isProduction() ) {
    bmconsole.log("warrantyURL => produccion");
    return 'https://service01.cat-technologies.com:4484/api';
  } else {
    bmconsole.log("warrantyURL => test");
    return 'http://190.104.197.146:5000';
  }
}
