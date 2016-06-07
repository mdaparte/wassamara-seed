var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var http = require('http');
var async = require('async');
var uuid = require('node-uuid');
var fs = require('fs');
var pg = require('pg');


var app = express();
var server = http.Server(app);

var port = process.argv[2] || 3000;
var ambiente = process.argv[3] || 'config.desenvolvimento';

require('./' + ambiente + '.js').setup(app);
var middleware = require('./middleware.js').setup(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(middleware.allowCrossDomain);

app.all('/back/*', middleware.requireAuthentication);
app.use('/prototipo', express.static(__dirname + '/../_prototipo'));
app.use('/', express.static(__dirname + '/../front/app'));

var handlers = require('./handlers');

server.listen(port, function () {
    console.log('escutando na porta ' + port + ' em ambiente de ' + ambiente);
}).on('error', function (err) {
});

process.on('uncaughtException', function (err) {
});


