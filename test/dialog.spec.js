describe('unit:angularQuickDialog', function() {
	var scope, $quickDialog, dialog;
    var dialogName = 'randomDialogName';

    beforeEach(angular.mock.module('angularQuickDialog'));

    describe('unit:angularQuickDialog:service', function() {
	    beforeEach(inject(function(_$rootScope_,  _$quickDialog_) {
	        $quickDialog = _$quickDialog_;
	        scope = _$rootScope_.$new();
	        scope.$digest();
	        dialog = $quickDialog.create(dialogName);
	    }));

	    it('$quickDialog should be defined', function() {
	        expect($quickDialog).toBeDefined();
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
	        expect(dialog.isVisible).toBe(false);
	    });

	    it('$quickDialog.open should set the dialog\'s visibility to true', function() {
	        $quickDialog.open(dialogName);

	        expect(dialog.isVisible).toBe(true);
	    });

	    it('$quickDialog.close should set the dialog\'s visibility to false', function() {
	        // Set it to true before trying to set it to false
	        $quickDialog.open(dialogName);
	        $quickDialog.close(dialogName);

	        expect(dialog.isVisible).toBe(false);
	    });

	    it('dialog.open should set the dialog\'s visibility to true', function() {
	        dialog.open();
	    
	        expect(dialog.isVisible).toBe(true);
	    });
	    
	    it('dialog.close should set the dialog\'s visibility to false', function() {
	        // Set it to true before trying to set it to false
	        dialog.open();
	        dialog.close();
	    
	        expect(dialog.isVisible).toBe(false);
	    });
	    
	    it('$quickDialog should work within a scope', function() {
	        scope.$quickDialog = $quickDialog;
	    
	        scope.$quickDialog.open(dialogName);
	        expect(dialog.isVisible).toBe(true);
	    
	        scope.$quickDialog.close(dialogName);
	        expect(dialog.isVisible).toBe(false);
	    });
	    
	    it('dialog should work within a scope', function() {
	    	scope.$quickDialog = $quickDialog;
	        scope.dialog = scope.$quickDialog.create(dialogName);

	        expect(scope.dialog.name).toBe(dialogName);
	        expect(scope.dialog.isVisible).toBe(false);
	    
	        scope.dialog.open();
	        expect(scope.dialog.isVisible).toBe(true);
	    
	        scope.dialog.close();
	        expect(scope.dialog.isVisible).toBe(false);
	    });
	});  // End service describe

	describe('unit:angularQuickDialog:directive', function () {
	    beforeEach(inject(function(_$rootScope_, _$compile_, _$quickDialog_) {
	        $quickDialog = _$quickDialog_;
	        scope = _$rootScope_.$new();
	        dialogEl = '<quick-dialog dialog-name="'+dialogName+'"></quick-dialog>';
	        dialogEl = _$compile_(dialogEl)(scope);
	        scope.$digest();
	    }));

	    it('should have angular defined', function() {
	        expect(angular).toBeDefined();
	    });

	    it('should have a dialog directive', function() {
	        expect(dialogEl).toBeDefined(); 
	    });

	    it('using the directive should save to service', function() {
	    	// Check for default value
	    	expect(dialogEl.isolateScope().dialog.isVisible).toBe(false);
	    });
	});  // End directive describe
});
