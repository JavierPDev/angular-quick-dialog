(function(window, angular, undefined) {
'use strict';

angular.module('angularQuickDialog', [])
    .factory('$quickDialog', function($rootScope) {
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

        function Dialog(name, shouldBroadcast) {
            this.isVisible = false;

            if (!name) {
                throw new Error('Dialog needs a name');
            }

            this.originalName = name;
            this.name = stripInvalidChars(name);
            this.shouldBroadcast = shouldBroadcast;
        }

        Dialog.prototype.open = function() {
            this.isVisible = true;
            visibleDialogs.push(this);

            if (this.shouldBroadcast) {
                $rootScope.$broadcast('quickDialog.opened', this.originalName);
            }
        };

        Dialog.prototype.close = function() {
            if (this.isVisible) {
                visibleDialogs.pop();
            }

            this.isVisible = false;

            if (this.shouldBroadcast) {
                $rootScope.$broadcast('quickDialog.closed', this.originalName);
            }
        };

        function open(dialogName) {
            dialogName = stripInvalidChars(dialogName);
            dialogs[dialogName].open();
        }

        function close(dialogName) {
            dialogName = dialogName ? stripInvalidChars(dialogName) : visibleDialogs.getTop().name;
            dialogs[dialogName].close();
        }

        function create(dialogName, shouldBroadcast) {
            dialogs[stripInvalidChars(dialogName)] = new Dialog(dialogName, shouldBroadcast);
            return dialogs[stripInvalidChars(dialogName)];
        }

        function reset() {
            dialogs = {};
            visibleDialogs.clear();
        }

        function stripInvalidChars(dialogName) {
            return dialogName.replace(/\.|\:/g, '_$_');
        }


        return {
            open: open,
            close: close,
            create: create,
            reset: reset
        };
    })

	.directive('quickDialog', function($timeout, $quickDialog) {
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


                scope.dialog = $quickDialog.create(attrs.dialogName, attrs.shouldBroadcast);
                
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


                // Clear cached dialogs and visiblility stack whenever switching views.
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
					

                    if (closeFocusEl !== null) {
                        closeFocusEl.focus();
                        closeFocusEl = originalExitFocusEl;
                    }
				}

				function onEsc(event) {
					if (event.keyCode === ESC) {
                        event.preventDefault();
                        $timeout(function() {
                            scope.dialog.close();
                        });
                        closeDialog();
					}
				}

                function onClick(event) {
                    event.stopPropagation();
					$timeout(function() {
						scope.dialog.close();
					});
                    closeDialog();
                }

			}
		};
	});
})(window, window.angular);

