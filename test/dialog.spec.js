// TODO: Test toggle method of service
describe('unit:angularQuickDialog:service', function() {
    var scope, $quickDialog, dialog;
    var dialogName = 'randomDialogName';

    beforeEach(angular.mock.module('angularQuickDialog'));

    beforeEach(inject(function(_$rootScope_,  _$quickDialog_) {
        $quickDialog = _$quickDialog_;
        scope = _$rootScope_.$new();
        scope.$digest();
        dialog = $quickDialog.create(dialogName);
    }));

    it('$quickDialog should be defined', function() {
        expect($quickDialog).toBeDefined();
    });

    it('$quickDialog should have a map of dialog objects based on names', function() {
        expect($quickDialog.dialogs).toBeDefined();
    });

    it('$quickDialog.create should add a new dialog', function() {
        // create() already called beforeEach above
        expect($quickDialog.dialogs[dialogName]).toBeDefined();
    });

    it('$quickDialog.create should return a dialog with properties', function() {
        var hasAllProps = true,
            dialog = $quickDialog.create(dialogName);

        if (dialog.name !== dialogName)
            hasAllProps = false;
        if (!dialog.open)
            hasAllProps = false;
        if (!dialog.close)
            hasAllProps = false;

        expect(hasAllProps).toBe(true);
    });

    it('$quickDialog.create should save new dialogs with an isVisible value of false', function() {
        expect($quickDialog.dialogs[dialogName].isVisible).toBe(false);
    });

    it('$quickDialog.get should return the dialog with the name entered', function() {
        expect($quickDialog.get(dialogName) === dialog).toBe(true);
    })

    it('$quickDialog.open should set the dialog\'s visibility to true', function() {
        $quickDialog.open(dialogName);

        expect($quickDialog.dialogs[dialogName].isVisible).toBe(true);
    });

    it('$quickDialog.close should set the dialog\'s visibility to false', function() {
        // Set it to true before trying to set it to false
        $quickDialog.open(dialogName);
        $quickDialog.close(dialogName);

        expect($quickDialog.dialogs[dialogName].isVisible).toBe(false);
    });

    // Probably get rid of it once stack functionality works.
    // it('dialog.open should set the dialog\'s visibility to true', function() {
    //     dialog.open();
    //
    //     expect(dialog.isVisible).toBe(true);
    // });
    //
    // it('dialog.close should set the dialog\'s visibility to false', function() {
    //     // Set it to true before trying to set it to false
    //     dialog.open();
    //     dialog.close();
    //
    //     expect(dialog.isVisible).toBe(false);
    // });
    //
    // it('$quickDialog should work within a scope', function() {
    //     scope.$quickDialog = $quickDialog;
    //
    //     scope.dialog = scope.$quickDialog.create(dialogName);
    //     expect(scope.dialog.name).toBe(dialogName);
    //     expect(scope.dialog.isVisible).toBe(false);
    //
    //     scope.$quickDialog.open(dialogName);
    //     expect(scope.dialog.isVisible).toBe(true);
    //
    //     scope.$quickDialog.close(dialogName);
    //     expect(scope.dialog.isVisible).toBe(false);
    //
    //     expect(scope.$quickDialog.get(dialogName)).toBe(scope.dialog);
    // });
    //
    // it('dialog should work within a scope', function() {
    //     scope.dialog = dialog;
    //
    //     expect(scope.dialog).toBe(dialog);
    //
    //     scope.dialog.open();
    //     expect(scope.dialog.isVisible).toBe(true);
    //
    //     scope.dialog.close();
    //     expect(scope.dialog.isVisible).toBe(false);
    // });
});



describe('unit:angularQuickDialog:directive', function () {
    var scope, element, $quickDialog;
    var dialogName = 'randomDialog-Name';
    beforeEach(angular.mock.module('angularQuickDialog'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$quickDialog_) {
        $quickDialog = _$quickDialog_;
        scope = _$rootScope_.$new();
        element = '<quick-dialog dialog-name="'+dialogName+'"></quick-dialog>';
        element = _$compile_(element)(scope);
        scope.$digest();
    }));

    it('should have angular defined', function() {
        expect(angular).toBeDefined();
    });

    it('should have a dialog directive', function() {
        expect(element).toBeDefined(); 
    });

    it('using the directive should save to service', function() {
        expect($quickDialog.dialogs[dialogName].name).toBe(dialogName);
    });
});

