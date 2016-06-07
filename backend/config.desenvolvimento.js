var _ = require('underscore');
var path = require('path');


var setup = function(app){

var connection_object = {
    client: 'pg',
    //debug: true,
    connection: {
        host: 'HOSTNAME',
        port: 5432,
        user: 'USER',
        password: 'PASSWORD',
        database: 'DATABASE',
        application_name: 'APP_NAME'
    }
};



var knex = require('knex')(connection_object);


app.set('session-options', {
    timezone: 'America/Sao_Paulo',
    duration: 30, //QUANTIDADE DE TEMPO
    period: 'minutes' //DURAÇÃO (SECONDS, HOURS, MINUTES)
});

app.set('knex', knex);
app.set('display_consulta_ok', false);
app.set('connection-object', connection_object.connection);


app.set('session-options', {
    timezone: 'America/Sao_Paulo',
    duration: 30, //QUANTIDADE DE TEMPO
    period: 'minutes' //DURAÇÃO (SECONDS, HOURS, MINUTES)
});


app.set('config', {
    ambiente: 'Desenvolvimento'
});

};

exports.setup = setup;