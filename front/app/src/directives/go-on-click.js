(function(){
    'use static';

    angular
    .module('app')
    .directive('goOnClick', directive);


    directive.$inject = ['$location'];

    function directive($location) {
        return function($scope, element, attrs) {
            var path;

            attrs.$observe('goOnClick', function(val) {
                path = val;
            });

            element.bind('click', function() {

                if(attrs.disabled){
                    return;
                }    

                $scope.$apply(function() {
                    $location.path(path);
                });
            });
        };
    }

})();
