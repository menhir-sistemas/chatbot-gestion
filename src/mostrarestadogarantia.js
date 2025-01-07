const main = async () => {
  //result.text('Usted eligio: '+ context.params.valueSelected);
  let garantias = JSON.parse(context.userData.variables.garantias);
  if (context.params.valueSelected === 'ninguno') {
    user.set('choice', null)
    result.gotoRule('Menu');
  }
  else {
    let garantia = garantias[parseInt(context.params.valueSelected)];
    /*result.text(context.params.valueSelected);
    result.text(garantia.accionarGarantia);*/
    if (garantia.accionarGarantia == true) {
      //result.text("Garantia validada. Continuando con la operación.");
      user.set('poliza', garantia.poliza);
      try {
        user.set('marcaProducto', garantia.marcaProducto);
      } catch (error) {
        user.set('marcaProducto', "");
      }
      user.set('sublineaProducto', garantia.sublineaProducto);
      user.set('codigoExtragarantia', garantia.codigoExtragarantia);
      result.gotoRule('vigente');
    }
    else {
      if (garantia.descripcionEstadoOt === 'Trámite finalizado') {
        result.gotoRule('finalizado');
      }
      else {
        result.gotoRule('fábrica');
      }
    }

  }
};

main()
  .catch(err => {
    // Code on error
    const errorMessage = `[Integration with api rest] :  ${err.message}`;
    bmconsole.log(errorMessage);
    bmconsole.log(garantias);
    bmconsole.log(context.params.valueSelected);
    result.gotoRule('Hablar con Agente');
  })
  .finally(result.done);
