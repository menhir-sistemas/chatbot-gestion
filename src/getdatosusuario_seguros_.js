//@constant('Use external service URI')
//const URI = 'https://service01.cat-technologies.com:4484/api';

let utils = require('utils');

const URI = utils.crmURL();

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA1MDA0NDgxfQ.Oafh2Xya6lIV8hlw1haYqDj_jVHneMkDVezN5Y-EGd4'

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    const uri = `${URI}/crm/cardif/getContacto?nro_documento=${context.userData.variables.documento}`;
    return rp({
        method: METHOD,
        uri: uri,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "auth-token": AUTHENTICATION,
        },
    });
}

const main = async () => {
    let response = await callServiceApiRest();
    response = JSON.parse(response);
    if (response["value"] && response["value"].length > 0) {
        user.set('id_contacto', response["value"][0]['contactid']);
    }
};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :   ${err.message}`;
        bmconsole.log(errorMessage);
        bmconsole.log(context.userData.variables.documento);
        user.set('CA_name', 'getDatosUsuario(Seguros)')
        //user.set('descripcion',`error: ${err.message}\n ${JSON.stringify(response)}`)
        result.gotoRule('Hablar con Agente');
    })
    .finally(result.done);