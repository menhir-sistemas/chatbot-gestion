const main = async () => {
    //result.text('Usted eligio: '+ context.params.valueSelected);
    let Localidades = JSON.parse(user.get('Localidades'));
    if (context.params.valueSelected === 'ninguno'){
           result.gotoRule('Hablar con Agente');
    }
    let localidad = Localidades[parseInt(context.params.valueSelected)];
  	result.text(`La localidad que coincide con el CP ingresado es *${localidad.Localidad.nombreLocalidad.toLowerCase()}*`);
      user.set('codigoLocalidad',localidad.Localidad.codigoLocalidad);
      user.set('codigoProvincia', localidad.Provincia.codigoProvincia);
   result.gotoRule('datos garantia');
};
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[CA_NAME] Error ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);
