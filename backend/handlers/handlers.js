var fw = require('../fw');
var business = require('../business');
var moment = require('moment-timezone');
var jwt = require('jwt-simple');
var _ = require('underscore');


var setup = function(app){
	
    var hf = new fw.handler_factory.HandlerFactory(app);    
    var session_options = app.get('session-options') || {};
    var jwtTokenSecret = app.get('jwtTokenSecret');

	//WE CAN SET REGULAR HANDLERS
    app.post('/app/validateToken', function (req, res) {
        if (!req.body.token) res.end();
        var token = req.body.token;
        //TRY TO UNPACK THE TOKEN
        var ret = { fail: true };
        try{
            ret = jwt.decode(token, app.get('jwtTokenSecret'));
        }catch(e){}
        res.json(ret).end();
    });

    app.post('/app/login', function(req, res){
        var retornoRequest = new fw.retorno_request.RetornoRequest();
        var parsed_parameters = req.body.dados || {};
        var retorno = {};

        try{
            var knex = app.get('knex');

            var expires = moment().tz(session_options.timezone).add(session_options.duration, session_options.period).valueOf();
            var p_login = parsed_parameters.login;
            var p_senha = parsed_parameters.senha;

			//QUERY TO DO THE LOGIN
            var query = knex
                .select('*')
                .from('usuario')
                .innerJoin('senha', 'senha.usuario_id', 'usuario.id')
                .where({ 'usuario.username': p_login, 'senha.senha': p_senha });

            query.then(function(model){

                if(!model.length){
                    throw 'Usuário não encontrado!';
                }

                var usuario = _.first(model);
                var token = jwt.encode({
                    iss: usuario,
                    exp: expires
                }, jwtTokenSecret);

                //console.log(usuario);
                retorno = retornoRequest.retornoSucesso('Consulta OK', false, '', req, usuario);
                retorno.token = token;

                res.json(retorno);
                res.end();

            }).catch(function(e){
                retorno = retornoRequest.retornoErro(e, true, 'alert', req, []);
                res.json(retorno);
                res.end();
            });


        }catch(e){
            retorno = retornoRequest.retornoErro(e, true, 'alert', req, []);
            res.json(retorno);
            res.end();
        }    


    });

    //OU HANDLERS QUE ACESSEM DADOS USANDO O HANDLER FACTORY
    hf.fabricateSimpleHandler('/teste/:opcoes?', 'get', function(parsed_parameters){
        console.log(parsed_parameters);
        parsed_parameters.blah = 'teste';
        return { mensagem: '', data: parsed_parameters, tipo: ''};
    });

    hf.fabricateSimpleHandler('/post/:opcoes?', 'post', function(parsed_parameters){
        console.log(parsed_parameters);
        return { mensagem: '', data: parsed_parameters, tipo: ''};
    });

    /*
       hf.fabricateTableSelectHandler('listar-usuarios', 
       'usuario', 
       ['usuario.id', 'usuario.username', 'pessoa.nome'], 
       [ {table: 'pessoa', joins: [
       { method: 'and', column1:'pessoa.id', op:'=', column2: 'usuario.pessoa_id'},
       { method: 'and', column1:'pessoa.id', op:'=', column2: 'usuario.pessoa_id'},
       ]} 
       ]);
       */

    hf.fabricateSelectHandler('buscar-jogador', 'jogador'); 	   
	   
    hf.fabricateSelectHandler(
        'buscar-pedido', 
        'pedidos_raquetes_detalhe as pedido', 
        [
            'pedido.*', 
            'status_raquete.descricao as status_raquete_descricao', 
            'status_raquete.dados_adicionais as status_raquete_dados_adicionais', 
            'local_entrega.descricao as local_entrega_descricao', 
            'local_entrega.dados_adicionais as local_entrega_dados_adicionais', 
            'raquete.descricao as raquete_descricao', 
            'raquete.dados_adicionais as raquete_dados_adicionais', 
            'grip.descricao as grip_descricao', 
            'grip.dados_adicionais as grip_dados_adicionais', 
            'corda_mains.descricao as corda_mains_descricao', 
            'corda_mains.dados_adicionais as corda_mains_dados_adicionais', 
            'corda_crosses.descricao as corda_crosses_descricao', 
            'corda_crosses.dados_adicionais as corda_crosses_dados_adicionais', 
            'pre_stretch_mains.descricao as pre_stretch_mains_descricao', 
            'pre_stretch_mains.dados_adicionais as pre_stretch_mains_dados_adicionais', 
            'pre_stretch_crosses.descricao as pre_stretch_crosses_descricao', 
            'pre_stretch_crosses.dados_adicionais as pre_stretch_crosses_dados_adicionais', 
            'tipo_medida_mains.descricao as tipo_medida_mains_descricao', 
            'tipo_medida_mains.dados_adicionais as tipo_medida_mains_ados_adicionais', 
            'tipo_medida_crosses.descricao as tipo_medida_crosses_descricao', 
            'tipo_medida_crosses.dados_adicionais as tipo_medida_crosses_ados_adicionais', 
            'jogador.id as jogador_id', 
            'jogador.nome as jogador_nome', 
            'jogador.sobrenome as jogador_sobrenome', 
            'jogador.email as jogador_email', 
            'jogador.telefone as jogador_telefone', 
            'jogador.celular as jogador_celular' 
        ], 
        [
            { table: 'jogador', joins: [
                {method: 'and', column1: 'pedido.jogador_id', op: '=', column2: 'jogador.id'}
            ]},

            { table: 'dominio as status_raquete', joins: [
                {method: 'and', column1: 'pedido.status_raquete_id', op: '=', column2: 'status_raquete.id'}
            ]},

            { table: 'dominio as local_entrega', joins: [
                {method: 'and', column1: 'pedido.local_entrega_id', op: '=', column2: 'local_entrega.id'}
            ]},

            { table: 'dominio as grip', joins: [
                {method: 'and', column1: 'pedido.grip_id', op: '=', column2: 'grip.id'}
            ]},

            { table: 'dominio as corda_mains', joins: [
                {method: 'and', column1: 'pedido.corda_mains_id', op: '=', column2: 'corda_mains.id'}
            ]},

            { table: 'dominio as corda_crosses', joins: [
                {method: 'and', column1: 'pedido.corda_crosses_id', op: '=', column2: 'corda_crosses.id'}
            ]},

            { table: 'dominio as pre_stretch_mains', joins: [
                {method: 'and', column1: 'pedido.pre_stretch_mains_id', op: '=', column2: 'pre_stretch_mains.id'}
            ]},

            { table: 'dominio as pre_stretch_crosses', joins: [
                {method: 'and', column1: 'pedido.pre_stretch_crosses_id', op: '=', column2: 'pre_stretch_crosses.id'}
            ]},

            { table: 'dominio as tipo_medida_mains', joins: [
                {method: 'and', column1: 'pedido.tipo_medida_mains_id', op: '=', column2: 'tipo_medida_mains.id'}
            ]},

            { table: 'dominio as tipo_medida_crosses', joins: [
                {method: 'and', column1: 'pedido.tipo_medida_crosses_id', op: '=', column2: 'tipo_medida_crosses.id'}
            ]},

            { table: 'dominio as raquete', joins: [
                {method: 'and', column1: 'pedido.modelo_raquete_id', op: '=', column2: 'raquete.id'}
            ]}
        ]);

        hf.fabricateTableAccessHandler('dominio', 'dominio');
        hf.fabricateTableAccessHandler('pedido', 'pedido');
        hf.fabricateTableAccessHandler('jogador', 'jogador');
        hf.fabricateTableAccessHandler('usuario', 'usuario');
};


exports.setup = setup;
