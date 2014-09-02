# Angular Quick Dialog
Lightweight Angularjs directive designed to be dropped into a project and used easily and quickly with no dependencies other than angularjs. Tested using jasmine and protractor and built with gulpjs. Distributed through the bower package manager.

## Demo
See it in action [here](http://embed.plnkr.co/kolkzLjV4tF2JWTcZFjF/preview).

## Usage

### Installation
Download the [raw, minified js file from this repository](https://raw.githubusercontent.com/JavierPDev/angular-quick-dialog/master/dist/angular-quick-dialog.min.js) and [css file](https://raw.githubusercontent.com/JavierPDev/angular-quick-dialog/master/src/angular-quick-dialog.css) or install production ready directory through [the bower package manager](http://bower.io):
```BASH
bower install angular-quick-dialog --save
```

Add script after angular.
```html
<script src="/vendor/angular/angular.min.js"></script>
<script src="/vendor/angular-quick-dialog/angular-quick-dialog.min.js"></script>
```

Add it as a dependency in your module. 
```javascript
angular.module('exampleApp', ['angularQuickDialog']);
```

### Features
* Uses a directive to create dialogs that can be controlled with an injectable factory service called $quickDialog.
* Pressing the escape key while the dialog is open will close it.
* Clicking on the page outside of the dialog will close the dialog.
* Clean, responsive css styling that is easily overwritten.

### Public API
##### $quickDialog.open
Opens a dialog based on name.  No return value.

| Param       | Type     | Description                             |
| ----------- | -------- | --------------------------------------- |
| Dialog name | *String* | Name of the dialog that will be opened. |


##### $quickDialog.close
Closes a dialog based on name or if no name is provided it closes the top-most/most recently opened dialog.  No return value.

| Param                   | Type     | Description                             |
|------------------------ | -------- | --------------------------------------- |
| _(optional)_ Dialog name | *String* | Name of the dialog that will be closed. |


### Directive use
Dialogs need a name.
```html
<quick-dialog dialog-name="options">
/*
 * Your content here
 */
</quick-dialog>
```

_(Optional)_ Enter the id of an element that you want the focus to switch to after opening the dialog.
*Note: Does not work in plunkr demo.*
```html
<quick-dialog dialog-name="options" open-focus="options-username">
/*
 * Your content here
 */
</quick-dialog>
```

Same for which element you want focus switched to when the dialog is closed.
*Note: Does not work in plunkr demo.*
```html
<quick-dialog dialog-name="options" open-focus="options-username" exit-focus="landing-name">
/*
 * Your content here
 */
</quick-dialog>
```

You can access the quick dialog controls by injecting the $quickDialog service.
```javascript
angular.module('exampleApp')
    .controller('MainCtrl', function($scope, $quickDialog) {
        $scope.$quickDialog = $quickDialog;
    });
```

Then use the open and close function respectively using the dialog's name. In html:
```html
<button ng-click="$quickDialog.open('options')">Open</button>
<button ng-click="$quickDialog.close('options')">Close</button>
```

Or in javascript:
```javascript
angular.module('exampleApp')
    .controller('MainCtrl', function($scope, $quickDialog) {
        $scope.$quickDialog = $quickDialog;
        $scope.loggedIn = true;

        $scope.$watch('loggedIn', function(newVal, oldVal) {
            if (newVal !== oldVal && !newVal) {
                $quickDialog.open('login');
            }
        });
    });
```

Dialogs can also be stacked:
```javascript
<quick-dialog dialog-name="options" open-focus="options-username" exit-focus="landing-name">
    <button ng-click="$quickDialog.open('options:account')">

    <quick-dialog dialog-name="options:account">
        /*
         * Your content here
         */
    </quick-dialog>
</quick-dialog>
```

If $quickDialog.close does not receive any arguments it will close the top most stacked dialog.


## Development
Install gulp, bower, karma, and protractor globally.
```BASH
npm install -g gulp bower karma protractor
```

Browse into the directory in the command line and install dependencies.
```BASH
bower install
npm install
```

To build the project (minification, dependency injection, loading $templateCache, etc.)
```BASH
gulp build
```

Test before committing.
```BASH
gulp test:unit
gulp test:e2e

# Do both
gulp test
```

