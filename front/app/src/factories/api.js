(function () {
    'use strict';


    angular
        .module('app')
        .factory('ApiFactory', factory);

    factory.$inject = ['$rootScope', '$q'];


    function factory($rootScope, $q) {

        var serviceSkeleton = function($rootScope, PatchedRestangular, handlers) {

            var select_url = handlers.select.url;
            var insert_url = handlers.insert.url;
            var update_url = handlers.update.url;
            var delete_url = handlers.delete.url;
            var save_url   = handlers.save.url;
        
            var _select = function(parametros, paginacao){
                parametros = parametros ? parametros : {};
                handlers.select.preEnvio = handlers.select.preEnvio ? handlers.select.preEnvio : function(x){ return x; };
                handlers.select.posRetorno = handlers.select.posRetorno ? handlers.select.posRetorno : function(x){ return x; };


                paginacao = paginacao ? paginacao : {};

                parametros = handlers.select.preEnvio(parametros);
                parametros = { options: { filtro: parametros, paginacao: paginacao } };

                return PatchedRestangular.all(select_url).post(parametros).then(function(model){
                    var deferred = $q.defer();
                    model = _.map(model, function(item){
                        item = handlers.select.posRetorno(item);
                        return item;
                    });

                    deferred.resolve(model);
                    return deferred.promise;

                });
            };

            var _insert = function(parametros){
                parametros = parametros ? parametros : {};
                handlers.insert.preEnvio = handlers.insert.preEnvio ? handlers.insert.preEnvio : function(x){ return x; };
                parametros = handlers.insert.preEnvio(parametros); 
                return PatchedRestangular.all(insert_url).post(parametros);
            };

            var _update = function(parametros){
                parametros = parametros ? parametros : {};
                handlers.update.preEnvio = handlers.update.preEnvio ? handlers.update.preEnvio : function(x){ return x; };
                parametros = handlers.update.preEnvio(parametros); 
                return PatchedRestangular.all(update_url).post(parametros);
            };

            var _delete = function(parametros){
                parametros = parametros ? parametros : {};
                handlers.delete.preEnvio = handlers.preEnvio.preEnvio ? handlers.save.preEnvio : function(x){ return x; };
                parametros = handlers.delete.preEnvio(parametros); 
                return PatchedRestangular.all(delete_url).post(parametros);
            };

            var _save = function(parametros){
                parametros = parametros ? parametros : {};
                parametros = { options: parametros };
                handlers.save.preEnvio = handlers.save.preEnvio ? handlers.save.preEnvio : function(x){ return x; };
                parametros = handlers.save.preEnvio(parametros); 
                return PatchedRestangular.all(save_url).post(parametros);
            };


            return {
                select: _select,
                insert: _insert,
                update: _update,
                delete: _delete,
                save  : _save
            };
        };

        return { 
            fabricate: serviceSkeleton
        };

    }


})();
