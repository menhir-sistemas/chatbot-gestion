const main = async () => {
    //result.text('Usted eligio: '+ context.params.valueSelected);
    let servicios = JSON.parse(context.userData.variables.servicios); servicio = servicios [parseInt(context.params.valueSelected)]
    
    let ss_tecnico = `Los datos asociados al servicio técnico son los siguientes:
            Nombre: ${servicio.nombreDeServicioTecnico}
            Dirección:${servicio.direccion}
            Horario de atención:${servicio.horarioDeAtencion}
            Email: ${servicio.email}
            Teléfono: ${servicio.telefono}
            Te recordamos que tenés 5 días hábiles para comunicarte y llevar tu producto al Servicio Técnico, de lo contrario esta Orden de Trabajo (OT) se dará de baja y tendrás que generar una nueva.`
        	user.set('codigo_sstecnico', servicio.codigoServicio);
  			user.set('datos_sstecnico', ss_tecnico);
        	result.gotoRule('st asignado');
};
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[CA_NAME] Error ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);