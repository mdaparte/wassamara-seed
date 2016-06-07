(function () {
    'use strict';


    angular
    .module('raquetes')
    .service('LoginService', service);

    service.$inject = ['$rootScope', '$http', 'NotifyService', 'AuthenticationService', 'SyncStorage', '$location'];


    function service($rootScope, $http, NotifyService, AuthenticationService, SyncStorage, $location) {

        var retorno = {};

        retorno.doLogin = function(login, senha, callback){

            $http.post('/app/login', {
                dados: {
                    login: login, 
                    senha: senha
                }
            }).then(function(model){
                model = model.data;
                var token = model.token;
                var data = model.data;

                var fail = false;

                if(model.message.notify){
                    NotifyService[model.message.kind](model.message.description);
                    fail = true;
                }

                if(!data || !data.id && !fail){
                    NotifyService.info('Nenhum usuário retornado');									
                    fail = true;
                }

                if(fail){
                    AuthenticationService.isAuthenticated = false;
                    AuthenticationService.username = '';
                    AuthenticationService.nome = '';
                    AuthenticationService.sobrenome = '';
                    AuthenticationService.id = '';
                    AuthenticationService.userData = {};
                    SyncStorage.removeItem('wassamara.raquetes');
                }else{
                    AuthenticationService.isAuthenticated = true;
                    AuthenticationService.username = data.username;
                    AuthenticationService.nome = data.nome;
                    AuthenticationService.sobrenome = data.sobrenome;
                    AuthenticationService.id = data.id;
                    AuthenticationService.userData = data;
                    SyncStorage.setItem('wassamara.raquetes', token);
                    callback(data);
                }
            });

        };


        retorno.doLogout = function(){
            try {

                AuthenticationService.isAuthenticated = false;
                AuthenticationService.username = '';
                AuthenticationService.nome = '';
                AuthenticationService.sobrenome = '';
                AuthenticationService.id = '';
                AuthenticationService.userData = {};

            } catch (e) {
            } finally {
                SyncStorage.removeItem('wassamara.raquetes');				
                $location.path('/login');
            }


        };


        retorno.doValidateToken = function (callback) {

            callback = callback || function(){};

            var token = SyncStorage.getItem('wassamara.raquetes');
            if (token) {
                $http.post('/app/validateToken', {
                    token: token
                })
                .success(function (data) {

                    if(data.fail){
                        AuthenticationService.getout();
                        return;
                    }

                    data = data.iss;
                    AuthenticationService.isAuthenticated = true;
                    AuthenticationService.username = data.username;
                    AuthenticationService.nome = data.nome;
                    AuthenticationService.sobrenome = data.sobrenome;
                    AuthenticationService.id = data.id;
                    AuthenticationService.userData = data;
                    SyncStorage.setItem('wassamara.raquetes', token);
                    callback(data);
                });
            } else {

                AuthenticationService.isAuthenticated = false;
                AuthenticationService.username = '';
                AuthenticationService.nome = '';
                AuthenticationService.sobrenome = '';
                AuthenticationService.id = '';
                AuthenticationService.userData = {};
                callback(undefined);
            }

        };


        return retorno;
    }

})();
