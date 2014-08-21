(function(window, angular, undefined) {
'use strict';

angular.module('angularQuickDialog', ['angularQuickDialog.template'])
    .factory('$quickDialog', function() {
        var dialogs = {},
            errorMsg = 'Dialog name is incorrect, it is an invalid javascript identifier (See: https://mathiasbynens.be/notes/javascript-identifiers), or it does not exist.';

        function Dialog(name) {
            this.isVisible = false;
            this.name = name;
        }

        Dialog.prototype.open = function() {
            this.isVisible = true;
        };

        Dialog.prototype.close = function() {
            this.isVisible = false;
        };

        Dialog.prototype.toggle = function() {
            this.isVisible = !this.isVisible;
        };

        function open(dialogName) {
            setState(dialogName, true);
        }

        function close(dialogName) {
            setState(dialogName, false);
        }

        function setState(dialogName, state) {
            try {
                dialogs[dialogName].isVisible = state;
            } catch (err) {
                throw new Error(errorMsg);
            }
        }

        function create(dialogName) {
            dialogs[dialogName] = new Dialog(dialogName);
            return dialogs[dialogName];
        }

        function get(dialogName) {
            try {
                return dialogs[dialogName];
            } catch (err) {
                throw new Error(errorMsg);
            }
        }

        return {
            dialogs: dialogs,
            open: open,
            close: close,
            create: create,
            get: get
        };
    })

	.directive('quickDialog', function($timeout, $quickDialog) {
		return {
			restrict: 'EA',
            templateUrl: 'template/quick-dialog.html', 
			scope: {},
			transclude: true,
			link: function(scope, element, attrs, ctrl, transclude) {
				var backdropEl = angular.element(document.createElement('div')).addClass('quick-dialog__backdrop'),
                    ESC = 27,
					body = angular.element(document.body),
					windowEl = angular.element(window),
					focusEl = document.getElementById(attrs.autoFocus) || element[0],
					exitFocusEl = document.getElementById(attrs.exitFocus),
					originalExitFocusEl = document.getElementById(attrs.exitFocus);


                try {
                    scope.dialog = $quickDialog.create(attrs.dialogName);
                } catch (e) {
                    throw new Error('Dialog needs a name.');
                }
                
                // Probably get rid of it once stack functionality works.
                // if (scope.$parent.dialog !== undefined) {
                //     throw new Error('Naming collision with \'dialog\' in quick-dialog directive\'s parent scope.');
                // } else {
                //     // Give transcluded content access to this dialog.
                //     scope.$parent.dialog = scope.dialog;
                // }


                scope.$watch('dialog.isVisible', function(isVisible) {
                    if (isVisible) {
                        openDialog();
                    } else {
                        closeDialog();
                    }
                });


                /**
                 * Clear cached dialogs whenever switching views
                 */
                scope.$on('$routeChangeStart', function() {
                    $quickDialog.dialogs = {};
                });



				function openDialog() {
					exitFocusEl = exitFocusEl || document.activeElement;
					body.append(backdropEl);
					backdropEl.bind('click', onClick);
					windowEl.bind('keydown', onEsc);

					$timeout(function autoFocus() {
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

                    if (exitFocusEl !== null) {
                        exitFocusEl.focus();
                        exitFocusEl = originalExitFocusEl;
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
	});
})(window, window.angular);

