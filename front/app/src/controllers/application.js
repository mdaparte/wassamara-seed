(function () {
    'use strict';


    angular
        .module('app')
        .controller('ApplicationController', controller);

    controller.$inject = ['$scope', '$rootScope'];


    function controller($scope, $rootScope) {

        $scope.init = function(){

        };
        $scope.init();
    }


})();