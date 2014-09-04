(function(window, angular, undefined) {
'use strict';

angular.module('angularQuickDialog', ['angularQuickDialog.template'])
    .factory('$quickDialog', function() {
        var dialogs = {},
            visibleDialogs = {
                stack: [],
                top: 0,
                push: function(dialog) {
                    this.stack[this.top++] = dialog;
                },
                pop: function() {
                    return this.stack[--this.top];
                },
                getTop: function() {
                    return this.stack[this.top - 1];
                },
                clear: function() {
                    this.top = 0;
                }
            };

        function Dialog(name) {
            this.isVisible = false;
            this.name = name;
        }

        Dialog.prototype.open = function() {
            this.isVisible = true;
            visibleDialogs.push(this);
        };

        Dialog.prototype.close = function() {
            // Avoid duplicate removals from stack
            if (this.isVisible) {
                visibleDialogs.pop();
            }

            this.isVisible = false;
        };

        function open(dialogName) {
            dialogs[dialogName].open();
        }

        function close(dialogName) {
            dialogName = dialogName || visibleDialogs.getTop().name;
            dialogs[dialogName].close();
        }

        function create(dialogName) {
            dialogs[dialogName] = new Dialog(dialogName);
            return dialogs[dialogName];
        }

        function reset() {
            dialogs = {};
            visibleDialogs.clear();
        }

        return {
            open: open,
            close: close,
            create: create,
            reset: reset
        };
    })

	.directive('quickDialog', ["$timeout", "$quickDialog", function($timeout, $quickDialog) {
		return {
			restrict: 'EA',
            templateUrl: 'template/quick-dialog.html', 
			scope: {},
			transclude: true,
			link: function(scope, element, attrs) {
				var backdropEl = angular.element(document.createElement('div')).addClass('quick-dialog__backdrop'),
                    ESC = 27,
					body = angular.element(document.body),
					windowEl = angular.element(window),
					focusEl = document.getElementById(attrs.openFocus) || element[0],
					closeFocusEl = document.getElementById(attrs.closeFocus),
					originalExitFocusEl = document.getElementById(attrs.closeFocus);


                try {
                    scope.dialog = $quickDialog.create(attrs.dialogName);
                } catch (e) {
                    throw new Error('Dialog needs a name.');
                }
                
                // Skip initial dirty check otherwise stack top becomes negative
                var initialCheck = true;
                scope.$watch('dialog.isVisible', function(isVisible) {
                    if (!initialCheck) {
                        if (isVisible) {
                            openDialog();
                        } else {
                            closeDialog();
                        }
                    }

                    initialCheck = false;
                });


                /**
                 * Clear cached dialogs and visiblility stack whenever switching views.
                 */
                scope.$on('$routeChangeStart', function() {
                    $quickDialog.reset();
                });



				function openDialog() {
					closeFocusEl = closeFocusEl || document.activeElement;
					body.append(backdropEl);
					backdropEl.bind('click', onClick);
					windowEl.bind('keydown', onEsc);

					$timeout(function openFocus() {
						focusEl.focus();
					});
				}

				function closeDialog() {
					windowEl.unbind('keydown', onEsc);
					backdropEl.unbind('click', onClick);
					backdropEl.remove();
					
					$timeout(function applyClose() {
						scope.dialog.close();
					});

                    if (closeFocusEl !== null) {
                        closeFocusEl.focus();
                        closeFocusEl = originalExitFocusEl;
                    }
				}

				function onEsc(event) {
                    // Listen for ESC press
					if (event.keyCode === ESC) {
                        event.preventDefault();
                        closeDialog();
					}
				}

                function onClick(event) {
                    event.stopPropagation();
                    closeDialog();
                }

			}
		};
	}]);
})(window, window.angular);


(function(module) {
try {
  module = angular.module('angularQuickDialog.template');
} catch (e) {
  module = angular.module('angularQuickDialog.template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/quick-dialog.html',
    '<div class="quick-dialog" ng-show="dialog.isVisible"><span class="quick-dialog__close" ng-click="dialog.close()">x</span><div class="quick-dialog__content" ng-transclude></div></div>');
}]);
})();
