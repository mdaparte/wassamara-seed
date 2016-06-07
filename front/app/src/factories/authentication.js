(function(){
    'use strict';	


    angular
    .module('app')
    .factory('AuthenticationService', factory);


    factory.$inject = ['$location'];

    function factory($location) {
        var uis = {
            isAuthenticated: false,
            username: '',
            login: '',
            url: null,
            foto: '',
            userData: {},
            askFor: function(){
                alert('codificar pergunta se deseja continuar sessao');
                $location.path('/login');
            },
            getout: function(){
                $location.path('/login');
            }
        };

        return uis;
    }


})();
