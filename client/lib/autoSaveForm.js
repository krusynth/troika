import gameClient from '../lib/GameClient.js';

/*
 * https://stackoverflow.com/questions/21135302/angularjs-autosave-form-is-it-the-right-way
 */
gameClient.directive('autoSaveForm', function($timeout) {
  return {
    require: ['^form'],
    link: function($scope, $element, $attrs, $ctrls) {

      var $formCtrl = $ctrls[0];
      var savePromise = null;
      var expression = $attrs.autoSaveForm || 'true';

      $scope.$watch(function() {

        if($formCtrl.$valid && $formCtrl.$dirty) {

          if(savePromise) {
            $timeout.cancel(savePromise);
          }

          savePromise = $timeout(function() {

            savePromise = null;

            // Still valid?

            if($formCtrl.$valid) {

              if($scope.$eval(expression) !== false) {
                console.log('Form data persisted -- setting prestine flag');
                $formCtrl.$setPristine();
              }

            }

          }, 500);
        }

      });
    }
  };
});