//@constant('Use external service URI')
const URI = 'https://service01.cat-technologies.com:33443/neoapi';
const METHOD = 'POST';
const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';

const OUTPUTS = {
  log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

function agregarNueve(numeroTelefono) {
    // Verificar si la subcadena "+549" está presente
    if (!numeroTelefono.includes("+549")) {
        // Agregar la subcadena "+549" al principio
        let numero_nuevo = numeroTelefono.replace('+54','+549')
        bmconsole.log(numero_nuevo)
        return numero_nuevo;
    }
	bmconsole.log(numeroTelefono)
    return numeroTelefono;
}

const callServiceApiRest = (formData) => {
    return rp({
        method: METHOD,
        uri: `${URI}/webservice.asmx/ExecuteTask01`,
        form: formData,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    });
}

const main = async() => {

  let form = {
      idtask: '281',
      param1: agregarNueve(context.userData.PLATFORM_CONTACT_ID),
  }
  bmconsole.log(form)
  const response = await callServiceApiRest(form);
  bmconsole.log(response);
  const xml = response;
  var parser = new xml2js.Parser(/* options */);
  let parsed_xml = await parser.parseStringPromise(xml);
  let typification = parsed_xml["string"]._ ? parsed_xml["string"]._ : null;
  if (typification === 'CLOSEDTIMEOUT'){
    user.set('abandono_user',true)
  }
  else{
    user.set('abandono_user',false)
  }
};

main()
    .catch((err) => {
        // Code on error
        bmconsole.log(err);

    })
    .finally(result.done);