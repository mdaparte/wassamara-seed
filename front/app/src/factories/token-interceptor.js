(function(){
    'use strict';

    angular
    .module('app')
    .factory('TokenInterceptor', factory);

    factory.$inject = ['$q', '$window', 'AuthenticationService', 'SyncStorage'];

    //service que fara a interceptacao dos requests, injetando o token nos headers de cada request.
    function factory($q, $window, AuthenticationService, SyncStorage) {
        return {
            request: function (config) {
                config.headers = config.headers || {};

                var coringa = Math.random();
                var token = SyncStorage.getItem('wassamara.raquetes', coringa);

                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                console.log('token interceptor', config.headers.Authorization);
                return config;
            },

            requestError: function (rejection) {
                return $q.reject(rejection);
            },


            /* setar AuthenticationService.isAuthenticated para true se recebeu response code = 200 */
            response: function (response) {


                if (response !== null && response.status === 200 && $window.localStorage.token && !AuthenticationService.isAuthenticated) {
                    if (!AuthenticationService.isAuthenticated) {
                        if (response.data && response.isAuthenticated) {
                            AuthenticationService.isAuthenticated = true;
                        } else {
                            AuthenticationService.isAuthenticated = false;
                        }
                    }
                }
                return response || $q.when(response);
            },

            /* revoke authentication se recebeu codigo 401 */
            responseError: function (rejection) {
                if (rejection !== null && rejection.status === 401 && (AuthenticationService.isAuthenticated)) {

                    AuthenticationService.isAuthenticated = false;
                    AuthenticationService.askFor();
                    
                }

                return $q.reject(rejection);
            }
        };
    }

})();
