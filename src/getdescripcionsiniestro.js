const main = async() => {
    let siniestro = context.userData.variables.estado_siniestro.toLowerCase().trim(), descripcion_estado = '';
    switch(siniestro){
    	case'pendiente inicial':
        case'pendiente cardif':
        	descripcion_estado += `Te informamos que nuestros especialistas están analizando tu siniestro para brindarte una respuesta dentro de los plazos comprometidos.
            Si de todas formas querés contactarte con un representante, Ingresá a "Hablar con asesor", de lo contrario muchas gracias por comunicarte.`;
        break;
        case'liquidado':
        	descripcion_estado += `Te informamos que tu siniestro fue aprobado y que en un plazo máximo de 15 días realizaremos el pago correspondiente. 
            Si de todas formas querés contactarte con un representante, Ingresá a "Hablar con asesor", de lo contrario muchas gracias por comunicarte.`;
        break;
        case'cerrado con pago':
        	descripcion_estado += `Te informamos que tu siniestro se encuentra Abonado. Ingresá a tu cuenta bancaria para verificar el pago. 
			Si de todas formas querés contactarte con un representante, Ingresá a "Hablar con asesor", de lo contrario muchas gracias por comunicarte.`;
        break;
        case'pagado totalmente':
        	descripcion_estado += `Te informamos que tu siniestro se encuentra Abonado. Ingresá a tu cuenta bancaria para verificar el pago. 
			Si de todas formas querés contactarte con un representante, Ingresá a "Hablar con asesor", de lo contrario muchas gracias por comunicarte.`;
        break;
        case'en tramitacion':
        	descripcion_estado += `Te informamos que nuestros especialistas están analizando tu siniestro para brindarte una respuesta dentro de los plazos comprometidos.
			Si de todas formas querés contactarte con un representante, Ingresá a "Hablar con asesor", de lo contrario muchas gracias por comunicarte.`
        break;
        case'en captura incompleta':
        	descripcion_estado += `Te informamos que nuestros especialistas están analizando tu siniestro para brindarte una respuesta dentro de los plazos comprometidos.
			Si de todas formas querés contactarte con un representante, Ingresá a "Hablar con asesor", de lo contrario muchas gracias por comunicarte.`
        break;
        case'liquidado total':
        	descripcion_estado += `Te informamos que tu siniestro fue aprobado y que en un plazo máximo de 15 días realizaremos el pago correspondiente. 
            Si de todas formas querés contactarte con un representante, Ingresá a "Hablar con asesor", de lo contrario muchas gracias por comunicarte.`;
        break;
        case'pagado total':
        	descripcion_estado += `Te informamos que tu siniestro se encuentra Abonado. Ingresá a tu cuenta bancaria para verificar el pago. 
			Si de todas formas querés contactarte con un representante, Ingresá a "Hablar con asesor", de lo contrario muchas gracias por comunicarte.`;
        break;
      default:
        result.gotoRule('Hablar con Agente');
        break;
    }
  	if (descripcion_estado !== '')
      context.userData.variables.descripcion_estado = descripcion_estado;
};

main()
    .catch(err => {
        // Code on error
        const errorMessage = `[User Basic Template] Error -  ${err.message}`;
        bmconsole.log(errorMessage); // Log Error
  		result.gotoRule('Hablar con Agente');
    })
    .finally(result.done);