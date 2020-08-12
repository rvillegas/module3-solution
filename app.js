(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItemsDirective)

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                foundedItems: '<',
                onRemove: '&'
            },
        };

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var menu = this;
        //console.log('Entro a MenuController');
        menu.found = [];
        MenuSearchService.initMenus();

        menu.removeItem = function (myId) {
            MenuSearchService.removeMenuById(myId);
            menu.found = MenuSearchService.getFoundMenus(menu.searchTerm);
        };
        menu.getMatchedMenuItems = function (searchterm) {
            menu.found = [];
            if (searchterm.trim() != '')
                menu.found = MenuSearchService.getFoundMenus(searchterm);

            //console.log('Search ' + menu.searchTerm);
            //console.log(menu.found);
        }
    }


    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        service.menus = [];
        // List of shopping items
        service.getMenus = function () {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            });
            return response;
        }

        service.initMenus = function () {
            //service.getMenus();
            var promise = service.getMenus();

            promise.then(function (response) {
                service.menus = response.data.menu_items;
                //console.log(service.menus);
            })
                .catch(function (error) {
                    console.log("Something went terribly wrong.");
                });

        }

        service.getFoundMenus = function (searchWord) {
            //console.log(service.menus.filter(menu => menu.name.toLowerCase().includes(searchWord.toLowerCase())));
            return service.menus.filter(menu => menu.name.toLowerCase().includes(searchWord.toLowerCase()));
        }

        service.removeMenuById = function (myId) {
            var idx = service.menus.findIndex(menu => menu.id == myId);
            service.removeMenu(idx);
        }

        service.removeMenu = function (itemIndex) {
            service.menus.splice(itemIndex, 1);
        }

    }




})();
