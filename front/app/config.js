(function(){
	function configState($stateProvider, $urlRouterProvider, $compileProvider, $provide) {

		// Set default state
		$urlRouterProvider.otherwise("/home");
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "views/index.html",
				controller: 'MainController',
				data: {
					pageTitle: 'Home - Raquetes',
					specialClass: 'blank'
				}
			})
			.state('login', {
				url: "/login",
				templateUrl: "views/login.html",
				controller: 'LoginController',
				data: {
					pageTitle: 'Página de Login',
					specialClass: 'blank'
				}
			})

	}
	
	var run = function($rootScope, $state, $location, LoginService){
		//CODIGOS DE INICIALIZACAO AQUI
		//QUANTIDADE PADRAO DE ITEMS POR PÁGINA
		$rootScope.itemsPerPage = 10;

		var redirect = null;

		//CASO USUARIO ATUALIZE PAGINA OU COLE DIRETO UM LINK EM OUTRA ABA, CERTIFICO O REDIRECT.
		if($location.$$path && $location.$$path !== '/login'){
			redirect = $location.$$path;
		}

		LoginService.doValidateToken(function(){
			if(redirect){
				$location.path(redirect);
			}
		});


		$rootScope.logout = LoginService.doLogout;
	};	

	angular
		.module('app')
		.config(configState)
		.run(run);
})();
