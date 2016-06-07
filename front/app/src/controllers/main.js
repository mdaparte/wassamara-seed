(function () {
    'use strict';


    angular
        .module('app')
        .controller('MainController', controller);

	//INJETAR TODOS OS SERVIÇOS USADOS PARA CÓDIGO NÃO SE PERDER APÓS MINIFICAÇÃO
    controller.$inject = ['$scope', '$rootScope', '$uibModal', 'AuthenticationService', 'PaginacaoFactory', 'SampleService'];


    function controller($scope, $rootScope, $uibModal, AuthenticationService, PaginacaoFactory, SampleService) {

		//COLOCAR EM TODAS AS CONTROLLERS
		$scope.a = function(){
            $scope.auth = AuthenticationService;
            if(!AuthenticationService.isAuthenticated){
                AuthenticationService.getout(); 
                return;
            }			
		};		
	
	
        $scope.init = function () {
            $scope.carregarDados();
        };


		//PARA TELAS COM FILTROS E PAGINACAO
        //PRIMEIRO DECLARAR AS VARIAVEIS FORA DA VARIAVEL DOS FILTROS
		$scope.jogador = '';
        $scope.pedido_id = '';
        $scope.status_raquete_id = '-1';

		//FILTRO
        $scope.opcoes = {
            jogador_id: -1,
            pedido_id: -1, 
            status_raquete_id: -1
        };		
		
		//DECLARAR PAGINACAO E OBTER DA FACTORY
		$scope.paginacao = PaginacaoFactory.getInstance();
        //PUXO QUANTIDADE PADRÃO DE ITEMS POR PÁGINA DO ROOTSCOPE
        $scope.paginacao.data.itemsPerPage = $rootScope.itemsPerPage;
		
		//CASO MUDE A PAGINA SELECIONADA, EFETUO A BUSCA NOVAMENTE
        $scope.$watch('paginacao.data.currentPage', function(_new, _old){
            if(_new === _old){
                return;
            }
            $scope.carregarDados();
        });		
		
		//OBSERVO VARIAVEL DO FILTRO ISOLADA E CASO NECESSARIO ATUALIZO FILTRO
        $scope.$watch('jogador', function(){
           if($scope.jogador instanceof Object){
                $scope.opcoes.jogador_id = $scope.jogador.id;   
           }else{
                $scope.opcoes.jogador_id = -1; 
           } 
        });

		//OBSERVO VARIAVEL DO FILTRO ISOLADA E CASO NECESSARIO ATUALIZO FILTRO
        $scope.$watch('status_raquete_id', function(){
            $scope.opcoes.status_raquete_id = parseInt($scope.status_raquete_id, 10);   
        });


		//OBSERVO VARIAVEL DO FILTRO ISOLADA E CASO NECESSARIO ATUALIZO FILTRO
        $scope.$watch('pedido_id', function(){
            if(!isNaN(parseInt($scope.pedido_id, 10))){
                $scope.opcoes.pedido_id = parseInt($scope.pedido_id, 10);   
            }else{
                $scope.opcoes.pedido_id = -1; 
            } 
        });		
		
		//CLIQUE DO BOTAO PESQUISAR
        $scope.pesquisar = function(){
			//MANDO PARA A PRIMEIRA PÁGINA SEMPRE QUE HOUVER NOVA CONSULTA.
            $scope.paginacao.data.currentPage = 1;
            $scope.carregarDados();
        };		
		
		
        $scope.carregarDados = function () {

			//VERIFICO FILTROS VÁLIDOS
            if($scope.opcoes.jogador_id === -1){
                $scope.opcoes = _.omit($scope.opcoes, 'jogador_id');
            } 

			//VERIFICO FILTROS VÁLIDOS
            if($scope.opcoes.status_raquete_id === -1){
                $scope.opcoes = _.omit($scope.opcoes, 'status_raquete_id');
            } 

			//VERIFICO FILTROS VÁLIDOS
            if($scope.opcoes.pedido_id === -1){
                $scope.opcoes = _.omit($scope.opcoes, 'pedido_id');
            } 

			//CHAMO METODO DO SERVICE
            SampleService.buscarSample($scope.opcoes, $scope.paginacao).then(function(resultado){
                $scope.samples = resultado.model;
                $scope.paginacao.data.total = resultado.total;
            });
			
			
        };		
		//FIM PARA TELAS COM FILTROS E PAGINACAO
		
		
		//CONSULTA SIMPLES
        $scope.consultaSimples = function () {
			//EXEMPLO DE CHAMADA
			
			//COLOCAR EM OPCOES OS FILTROS QUE DESEJAR.
			var opcoes = {
				id: 1
			};
			SampleService.select(opcoes).then(function(model){
				//MODEL POPULADA COM RESULTADO DA CONSULTAR
				console.log(model);
			});
        };
		//FIM CONSULTA SIMPLES
		
		//EXEMPLO MODAL
         $scope.novoPedido = function () {
            $rootScope.modalCallback = function(){};

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/partials/modal.html',
                controller: 'MainController',
                windowClass: 'hmodal-info',
                size: 'lg',
                resolve: {
					//AS PROPRIEDADES DO 'RESOLVE' SERÃO PASSADAS COM SERVICOS PARA O CONTROLLER DA MODAL
                    getScope: function(){
                        return $scope;
                    }
                }
            });
        };    		
		//FIM EXEMPLO MODAL

        $scope.init();
    }


})();