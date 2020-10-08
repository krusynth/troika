import gameClient from '../lib/GameClient.js';

export default function controllerFactory(controller) {
  gameClient.config(function($stateProvider) {
    $stateProvider.state({
      name: controller.name,
      url: controller.url,
      component: controller.name
    });
  });

  gameClient.component(controller.name, {
    templateUrl: controller.template,
    controller: controller
  });

  gameClient.controller(controller.name,
    ['$rootScope', '$scope', '$http', '$state', '$sce', 'SocketService', controller]
  );
}