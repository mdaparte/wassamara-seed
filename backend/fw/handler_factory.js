
var ring = require('ring');
var fw = require('../fw');
var _ = require('underscore');
var display_consulta_ok = false;
var Q = require('bluebird');

var HandlerFactory = ring.create({
    constructor: function(app){
        this.app = app;
    },

    fabricateSelectHandler: function(url_suffix, table_or_view, fields, joins){


        var knex = this.app.get('knex');       
        var retornoRequest = new fw.retorno_request.RetornoRequest();

        console.log('creating handler select POST /back/' + url_suffix);

        this.app.post('/back/' + url_suffix, function(req, res){
            var parameters = req.body.options ? req.body.options : { filtro: {}, paginacao : {}};
            var paginacao = parameters.paginacao;
            var retorno = {};
            var query_paginada = false;


            //console.log(parameters);
            
            var like_filters = _.compact(_.map(_.keys(parameters.filtro), function(key){
                if(key.indexOf('_like') !== -1){
                    var retorno = {};
                    retorno[key.replace('_like', '')] = parameters.filtro[key];
                    parameters.filtro = _.omit(parameters.filtro, key);
                    return retorno;
                }
            }));
            
            

            try{
                var where = false;
                
                query = knex.select(fields || '*').from(table_or_view);
                if(parameters.filtro && _.keys(parameters.filtro).length){
                    query.where(parameters.filtro);
                    where = true;
                }


                var where_like = [];
                if(like_filters.length){
                    for(var i = 0;i<like_filters.length;++i){
                        where_like.push(' lower(' + _.keys(like_filters[i])[0] + ") like '%" + like_filters[i] [ _.keys(like_filters[i])[0] ].toLowerCase() + "%'");
                    }
                }

                if(where_like.length){
                    var whereMethod = where ? 'andWhereRaw' : 'whereRaw'; 
                    query[whereMethod]('(' + where_like.join(' or ') + ')');
                }

                if(joins && joins.length){
                    joins.forEach(function(j){
                        var i = 0;
                        query.leftJoin(knex.raw(j.table), function(){
                            
                            var joiner = this;
                            
                            j.joins.forEach(function(jo){
                                var method = i === 0 ? 'on' : jo.method == 'and' ? 'andOn' : 'orOn';
                                i++;
                                joiner[method](jo.column1, jo.op, jo.column2);
                            }); 
                        });
                    });
                }

                
               
                var query_count_string = query.toString();

                if (paginacao && paginacao.data && _.keys(paginacao.data).length > 0) {
                    query_paginada = true;
                    var offset = paginacao.data.itemsPerPage * paginacao.data.currentPage;
                    offset = offset > 0 ? offset - paginacao.data.itemsPerPage : offset;
                    query 
                    .limit(paginacao.data.itemsPerPage)
                    .offset(offset);
                }


                //MONTO A QUERY PARA PEGAR A QUANTIDADE TOTAL DE REGISTROS.
                var query_count = knex.select(knex.raw('count(1) as count')).from(knex.raw('(' + query_count_string + ') as f'));

                var queries  = Q.props({
                    model : query,
                    count : query_count //[{ count: 1 }]    
                });
                                    


                //console.log(query_count.toString());

                queries.then(function(resultado){
                    var model = resultado.model;
                    var count = parseInt(_.first(resultado.count).count || 0, 10);
                    retorno = retornoRequest.retornoSucesso('OK', display_consulta_ok, 'notification', req, model); 
                    retorno.total = count;
                    res.json(retorno);
                    res.end();
                }).catch(function(e){
                    console.log(e);
                    retorno = retornoRequest.retornoErro(e, true, 'alert', req, []);
                    res.json(retorno);
                    res.end();
                });

            }catch(e){
                //console.log('erro');
                retorno = retornoRequest.retornoErro(e, true, 'alert', req, []);
                res.json(retorno);
                res.end();
            }

            
        });
 
    },
    fabricateTableAccessHandler: function(url_suffix, table_or_view, fields, joins){
        var knex = this.app.get('knex');       
        var retornoRequest = new fw.retorno_request.RetornoRequest();

        this.app.post('/back/tables/excluir-' + url_suffix, function(req, res){
            try{
                var parameters = req.body.options ? req.body.options : {};
        
                query = knex(table_or_view).del().where(options).exec();

                query.then(function(retorno){
                    retorno = retornoRequest.retornoSucesso('OK', display_consulta_ok, 'notification', req, retorno); 
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


        this.app.post('/back/tables/salvar-' + url_suffix, function(req, res){
            
            try{ 
                var options = req.body.options ? req.body.options : {};
                var retorno = null;
                var method = 'insert';
            
                if(_.has(options, 'id')){
                    method = 'update';
                }
            
                query = knex(table_or_view).returning('id')[method](options);

                if(method === 'update'){
                    query.where({id: options.id});
                }

                //console.log(query.toString());
                query.then(function(retorno){
                    retorno = retornoRequest.retornoSucesso('OK', display_consulta_ok, 'notification', req, retorno); 
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

        console.log('creating handler POST /back/tables/buscar-' + url_suffix);

        this.app.post('/back/tables/buscar-' + url_suffix, function(req, res){
            var parameters = req.body.options ? req.body.options : { filtro: {}, paginacao : {}};
            var retorno = {};

            var like_filters = _.compact(_.map(_.keys(parameters.filtro), function(key){
                if(key.indexOf('_like') !== -1){
                    var retorno = {};
                    retorno[key.replace('_like', '')] = parameters.filtro[key];
                    parameters.filtro = _.omit(parameters.filtro, key);
                    return retorno;
                }
            }));
            
            

            try{
                var where = false;
                
                query = knex.select(fields || '*').from(table_or_view);
                if(parameters.filtro && _.keys(parameters.filtro).length){
                    query.where(parameters.filtro);
                    where = true;
                }


                var where_like = [];
                if(like_filters.length){
                    for(var i = 0;i<like_filters.length;++i){
                        where_like.push(' lower(' + _.keys(like_filters[i])[0] + ") like '%" + like_filters[i] [ _.keys(like_filters[i])[0] ].toLowerCase() + "%'");
                    }
                }

                if(where_like.length){
                    var whereMethod = where ? 'andWhereRaw' : 'whereRaw'; 
                    query[whereMethod]('(' + where_like.join(' or ') + ')');
                }

                if(joins && joins.length){
                    joins.forEach(function(j){
                        var i = 0;
                        query.leftJoin(knex.raw(j.table), function(){
                            
                            var joiner = this;
                            
                            j.joins.forEach(function(jo){
                                var method = i === 0 ? 'on' : jo.method == 'and' ? 'andOn' : 'orOn';
                                i++;
                                joiner[method](jo.column1, jo.op, jo.column2);
                            }); 
                        });
                    });
                }

                
//                console.log(query.toString());
                
                query.then(function(retorno){
                    retorno = retornoRequest.retornoSucesso('OK', display_consulta_ok, 'notification', req, retorno); 
                    res.json(retorno);
                    res.end();
                }).catch(function(e){
                    retorno = retornoRequest.retornoErro(e, true, 'alert', req, []);
                    res.json(retorno);
                    res.end();
                });

            }catch(e){
                //console.log('erro');
                retorno = retornoRequest.retornoErro(e, true, 'alert', req, []);
                res.json(retorno);
                res.end();
            }

            
        });
    },

    fabricateSimpleHandler: function(path, method, callback){
       
        var retornoRequest = new fw.retorno_request.RetornoRequest();
        
        switch(method){
            case 'get':
                this.app.get(path, function(req, res){
                    var opcoes = req.params.opcoes ? JSON.parse(req.params.opcoes) : { filtro: {}, paginacao: {}};
                    var retorno = {};
                    try{
                        var resultado_chamada = callback(opcoes, req, res);
                        retorno = retornoRequest.retornoSucesso(resultado_chamada.mensagem, display_consulta_ok,resultado_chamada.tipo, req, resultado_chamada.data); 
                    }catch(e){
                        retorno = retornoRequest.retornoErro(e, true, 'alert', req, []);
                    }
                    
                    res.json(retorno);
                    res.end();
                });
                break;
            case 'post':
                this.app.post(path, function(req, res){
                    var dados = req.body.dados || {};
                    var retorno = {};

                    try{
                        var resultado_chamada = callback(dados, req, res);
                        retorno = retornoRequest.retornoSucesso(resultado_chamada.mensagem, req.body.notificar, resultado_chamada.tipo, resultado_chamada.data);
                    }catch(e){
                        retorno = retornoRequest.retornoErro(e, true, 'alert', req, []);
                    }    

                    res.json(retorno);
                    res.end();
                        
                });
                break;
        }
    }
 });



 exports.HandlerFactory = HandlerFactory;

 
