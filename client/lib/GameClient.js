var gameClient = angular.module('gameClient', ['ui.router', 'ngAnimate', 'ngSanitize']);

gameClient.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);
export default gameClient;
