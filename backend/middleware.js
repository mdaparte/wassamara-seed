var jwt = require('jwt-simple');
var _ = require('underscore');
var fw = require('./fw');
var moment = require('moment-timezone');



var setup = function(app){
	
	
    var session_options = app.get('session-options') || {};

	
	//REPLACE 123456 FOR A BETTER SALT FOT JWT
    app.set('jwtTokenSecret', '123456');

    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        if ('OPTIONS' == req.method) {
            res.send(200);
        } else {
            next();
        }
    };

    var requireAuthentication = function(req, res, next) {

        if (req.headers.authorization) {
            try {
                var ret = jwt.decode(_.last(req.headers.authorization.split(' ')), app.get('jwtTokenSecret'));
                if (ret) {
                    var check = moment().diff(moment(ret.exp), 'seconds');
                    if (check > 0) {
                        var retorno = fw.retorno.retorno_warning('Sessão Expirada!', true, 'alert', req, []);
                        res.json(retorno);
                        res.end();
                        return;
                    }

                    var expires = moment().tz(session_options.timezone).add(session_options.duration, session_options.period).valueOf();
                    ret.exp = expires;
                    req.token = jwt.encode(ret, app.get('jwtTokenSecret'));
                    req.usuario_id = ret.iss.id;
                    next();
                }
            } catch (exc) {
                var retorno = fw.retorno.retorno_erro(exc, true, 'alert', req, []);
                res.json(retorno);
                res.end();
            }
        } else {
            var retorno = fw.retorno.retorno_erro('Não autenticado', true, 'alert', req, []);
            res.json(retorno);
            res.end();

        }
    };


    return {
        allowCrossDomain: allowCrossDomain,
        requireAuthentication: requireAuthentication
    }
};





exports.setup = setup;
