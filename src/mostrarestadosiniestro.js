const main = async () => {
    //result.text('Usted eligio: '+ context.params.valueSelected);
    let siniestros = JSON.parse(context.userData.variables.siniestros);
  	bmconsole.log(siniestros);
  	bmconsole.log(context.params.valueSelected);
    if (context.params.valueSelected === 'ninguno'){
          result.gotoRule('Hablar con Agente');
    }
    for(let i = 0;i < siniestros.length; i++){
        if (siniestros[i].bfs_idsiniestro === context.params.valueSelected) {
          context.userData.variables.estado_siniestro = siniestros[i].bfs_estado;
          //result.text(`Estado:${siniestros[i].estado}`)
          result.gotoRule('continuar siniestros');
       }
    }
};
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  ${err.message}`;
        bmconsole.log(errorMessage);
        bmconsole.log(context.params.valueSelected);
        bmconsole.log(siniestros);
        result.gotoRule('Hablar con Agente');
    })
    .finally(result.done);
