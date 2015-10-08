var context = require('../support/context');

module.exports = function ModalSteps() {

    /*
     * Show a modal
     */
    this.Then(/^I see the modal "([^"]*)"$/, function(modalName, callback) {
        var _this = this;
        var modalBody = element(by.css('body.modal-open'));

        modalBody.isPresent().then(function isOpen(result) {
            if (result !== true) {
                _this.handleError("Unable to retrieve element (Modal is not open). Binding: " + JSON.stringify(elementBinding) + ", currentPageInstance.url: " + context.getCurrentPageInstance().url, callback);
            } else {
                var titleBinding = element(by.binding(context.getCurrentPageInstance().getModalElement(modalName)));
                titleBinding.isPresent().then(function isPresentSuccess(result) {
                    if (result !== true) {
                        _this.handleError("Unable to retrieve element (Modal is not correct). Binding: " + JSON.stringify(by.css(context.getCurrentPageInstance().getModalElement(modalName))) + ", currentPageInstance.url: " + context.getCurrentPageInstance().url, callback);
                    } else {
                        _this.delayCallback(callback);
                    }
                });
            }
        });
    });

    /*
     * Accept the confirm modal
     */
    this.Then(/^I accept confirm modal$/, function (callback) {
        _this = this;

        var button = element(by.css('.modal-content button[ng-click="confirm()"]'));

        if (button.isPresent()) {
            button.click();
            _this.delayCallback(callback);
        } else {
            _this.handleError("Confirm button is not present", callback);
        }

    });

};
