import BaseController from './BaseController.js';
import controllerFactory from '../lib/controllerFactory.js';

export default class LobbyController extends BaseController {
  static name = 'lobby';
  static template = '/partials/lobby.html';
  static url = '/';

  // Angular's internals appear to require an explicit constructor.
  constructor($rootScope, $scope, $http, $state, $sce, SocketService) {
    super($rootScope, $scope, $http, $state, $sce, SocketService);
  }
}

controllerFactory(LobbyController);
