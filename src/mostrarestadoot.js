const main = async () => {
    //result.text('Usted eligio: '+ context.params.valueSelected);
    let ots = JSON.parse(context.userData.variables.ots);
  	bmconsole.log(ots)
  	bmconsole.log(context.params.valueSelected)
    if (context.params.valueSelected === 'ninguno'){
          result.gotoRule('Hablar con Agente');
    }
    else{
        let ot = ots[parseInt(context.params.valueSelected)];
        user.set('msgCliente',ot.msgCliente);
        user.set('numeroOrdenDeTrabajo',ot.numeroOrdenDeTrabajo);
        result.gotoRule('datos OT');
    }
};
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  ${err.message}`;
        bmconsole.log(errorMessage);
        bmconsole.log(ots);
  		bmconsole.log(context.params.valueSelected);
        result.gotoRule('Hablar con Agente');
    })
    .finally(result.done);
