import gameClient from '../lib/GameClient.js';

export default class DiceDrawerController {
  result = '';

  constructor($scope) {
    this.$scope = $scope;

    console.log('DiceDrawerController.constructor');
  }
  $onInit() {
    console.log('parent.socket', this.parent.socket);
  }

  roll(dice) {
    this.parent.send('roll', {dice: dice}).then(result => {
      console.log('roll result', result);
      this.$scope.result = result;
      this.$scope.$apply();
    });
  }
}

gameClient.component('diceDrawer', {
  templateUrl: '/partials/diceDrawer.html',
  controller: ['$scope', DiceDrawerController],
  bindings: {
    parent: '<'
  }
})
.directive('diceButton', function() {
  return {
    transclude: true,
    scope: {
      dice: '@',
      roll: '&roll',
      result: '<'
    },
    template: `<button class="action-button roll-dice"
      title="Roll {{dice}}"
      ng-click="roll({dice:dice})"
      ng-transclude></button>`
  }
});