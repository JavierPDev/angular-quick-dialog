(function(module) {
try {
  module = angular.module('angularQuickDialog');
} catch (e) {
  module = angular.module('angularQuickDialog', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/quick-dialog.html',
    '<div class="quick-dialog" ng-show="dialog.isVisible"><span class="quick-dialog__close" ng-click="dialog.close()">x</span><div class="quick-dialog__content" ng-transclude></div></div>');
}]);
})();
