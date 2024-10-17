/**
 * Tabla de feriados adicionales
 */
feriadosAdicionales: () =>{
  return [
    {fecha: '2024-10-21', tipo: 'custom', nombre: 'Día del seguro 2024'},
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
}
