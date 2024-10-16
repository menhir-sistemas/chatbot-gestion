const main = async () => {
    //result.text('Usted eligio: '+ context.params.valueSelected);
    if (context.params.valueSelected === 'ninguno'){
          result.gotoRule('Hablar con Agente')
    }
    else{
      //es numero?
      let isnum = /^\d+$/.test(context.params.valueSelected);
      
      if (isnum){
        result.gotoRule("Hablar con Agente");
      }
      else{
        result.gotoRule("continuar cert ");
      }
    }
};
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  ${err.message}`;
        bmconsole.log(errorMessage);
        bmconsole.log(context.params.valueSelected);
        result.gotoRule('Hablar con Agente');
    })
    .finally(result.done);
