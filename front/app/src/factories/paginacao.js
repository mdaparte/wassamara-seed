(function(){
    'use strict';

    angular
    .module('app')
    .factory('PaginacaoFactory', factory);

    //factory.$inject = [];

    function factory() {

        var Pagination = function () {
            this.data = {};

            this.data.itemsPerPage = 10;
            this.data.currentPage = 0;

            this.prevPage = function () {
                if (this.data.currentPage > 0) {
                    this.data.currentPage--;
                }
            };

            this.prevPageDisabled = function () {
                return this.data.currentPage === 0 ? "disabled" : '';
            };

            this.nextPage = function () {
                if (this.data.currentPage < pagination.pageCount() - 1) {
                    this.data.currentPage++;
                }
            };

            this.setPage = function (n) {
                this.data.currentPage = n;
            };

            this.nextPageDisabled = function () {
                return this.data.currentPage === pagination.pageCount() - 1 ? "disabled" : '';
            };

            this.pageCount = function () {
                return Math.ceil(pagination.data.total / pagination.data.itemsPerPage);
            };

            this.calculateVisiblePages = function () {
                var start = this.data.currentPage - 4;
                var end = this.data.currentPage + 4;

                var totalPages = this.pageCount();
                if (start < 0) {
                    start = 0;
                }

                if (end > totalPages) {
                    end = totalPages;
                }
                return _.range(start, end);
            };
        };


        return {
            getInstance : function(){
                return new Pagination();
            }
        };


    }

})();
