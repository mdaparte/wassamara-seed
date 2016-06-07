
(function(){
    'use strict';
    angular
    .module('app')
    .factory('PatchedRestangular', service);


    service.$inject = ['Restangular', '$rootScope', '$window', '$location', 'NotifyService', 'SyncStorage'];

    function service(Restangular, $rootScope, $window, $location, NotifyService, SyncStorage) {

        var getDescription = function (d) {
            var desc = d.description;
            var retorno = d.description;

            if (desc.name && desc.length && desc.detail) {
                retorno = 'Erro Crítico!: Código: ' + d.code + ', Detalhe: ' + d.detail;
            }

            if (d.debug_info) {
                retorno += ' - DEBUG_INFO: ' + d.debug_info;
            }
            return retorno;
        };


        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('/back');
            RestangularConfigurer.addRequestInterceptor(function (element, operation, what, url) {
                return element;
            });


            RestangularConfigurer.setResponseExtractor(function (response, operation, what, url) {

                //CASO VENHA UM TOKEN, ATUALIZO O TOKEN DO LOCAL STORAGE.
                if(response.token) {
                    SyncStorage.setItem('wassamara.raquetes', response.token);
                }

                if (response && response.message && response.message.notify) {

                    if (_.isArray(response.message.description)) {
                        response.message.description = response.message.description.join('\n');
                    }

                    if (getDescription(response.message) === 'Sessão Expirada!' || getDescription(response.message) === 'Não autenticado') {

                        try {

                            AuthenticationService.isAuthenticated = true;
                            AuthenticationService.login = '';
                            AuthenticationService.username = '';
                            AuthenticationService.userData = {};


                            $rootScope.isAuthenticated = false;
                            $rootScope.login = '';
                            $rootScope.username = '';

                            if ($rootScope.modal){
                                $rootScope.modal();
                            }    
                        } catch (e) {
                        } finally {
                            //console.log('XXXXX - REMOVENDO TOKEN NO FINALLY');
                            SyncStorage.removeItem('wassamara.raquetes');
                            $location.path('/login');
                        }
                    }

                    
                    if (response.message.notifyKind && response.message.notifyKind === 'alert') {
                        //AlertService.alert_kind(getDescription(response.message), response.message.title, response.message.kind);
                        NotifyService.info(getDescription(response.message));

                    } else {

                        //NotificationService.pop(response.message.kind, getDescription(response.message));
                        NotifyService.info(getDescription(response.message));
                    }

                }

                if (response && response.message && !!response.message.ok) {

                    if (!(getDescription(response.message) && getDescription(response.message) === 'EmptyResponse')) {
                    }

                }

                var retorno = response.data || response;
                retorno.total = response.data ? response.total : 0;
                return retorno;
            });

        });
    }

})();
