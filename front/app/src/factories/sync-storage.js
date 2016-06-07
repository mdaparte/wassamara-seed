(function () {
    'use strict';


    angular
    .module('app')
    .factory('SyncStorage', factory);

    var locked = false;

    factory.$inject = ['$window', '$interval', '$q'];


    function factory($window, $interval, $q) {
        var max_attempts = 50;
        var setItem = function (item_key, item_value) {
            var deferred = $q.defer();

            var ha_item = $window.localStorage.getItem(item_key);

            if(locked && ha_item){
                var retorno = null;
                var actual_attempt = 0;
                var stop = $interval(function() {

                    ++actual_attempt;

                    if(!locked){
                        $window.localStorage.setItem(item_key, item_value);
                        $interval.cancel(stop);
                        deferred.resolve(null);
                    }

                    if(actual_attempt > max_attempts){
                        $interval.cancel(stop);
                        deferred.resolve(null);
                    }
                }, 1);

            }else{
                $window.localStorage.setItem(item_key, item_value);
                deferred.resolve(null);
            }

            return deferred.promise;

        };

        var getItem = function (item_key, cabbb) {
            locked = true;
            var retorno = $window.localStorage.getItem(item_key);
            //if(!retorno)console.log(cabbb, 'retorno', retorno);
            locked = false;
            return retorno;

        };


        var removeItem = function(item_key){
            //console.error('removou o token aqui');
            $window.localStorage.removeItem(item_key);
        };


        return {
            setItem: setItem,
            getItem: getItem,
            removeItem: removeItem
        };


    }

}());
