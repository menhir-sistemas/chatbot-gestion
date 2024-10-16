//@constant('Use external service URI')
const URI = 'https://service01.cat-technologies.com:4484/api';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'POST';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const getToken = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/rt/createToken`,
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
}

const main = async() => {
    //const response = await getToken();
    context.userData.variables.token =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA1MDA0NDgxfQ.Oafh2Xya6lIV8hlw1haYqDj_jVHneMkDVezN5Y-EGd4'

};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  Error - ${err.message}`;
        OUTPUTS.log(errorMessage);
    })
    .finally(result.done);