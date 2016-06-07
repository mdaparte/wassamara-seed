(function () {
    'use strict';


    angular
        .module('app')
        .factory('SampleService', service);

    service.$inject = ['$rootScope', 'PatchedRestangular', 'ApiFactory', '$q'];

    function service($rootScope, PatchedRestangular, ApiFactory, $q){
        
        var handlers = {
            select: {
                url : '/tables/buscar-sample'
            },
            insert: {
                url: '/tables/salvar-sample'
            },
            update: {
                url: '/tables/salvar-sample'
            },
            delete: { 
                url :'/tables/excluir-sample'
            }, 
            save: {
				url:'/tables/salvar-sample'
            }
        };

        var methods = ApiFactory.fabricate($rootScope, PatchedRestangular, handlers);


        methods.buscarSample = function(parametros, paginacao){
            parametros = parametros ? parametros : {};
            paginacao = paginacao ? paginacao : {};
            parametros = { options: { filtro: parametros, paginacao: paginacao } };
            return PatchedRestangular.all('buscar-sample').post(parametros).then(function(model){
                var deferred = $q.defer();
                var total = model.total;
                model = _.map(model, function(item){
                    item = item;
                    return item;
                });
                deferred.resolve({model: model, total: total});
                return deferred.promise;
            });
        };


        return methods;
    }


})();
