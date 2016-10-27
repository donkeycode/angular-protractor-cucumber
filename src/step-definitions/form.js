var context = require('../support/context');

module.exports = function FormSteps() {

    /**
     *  Check select box by ngModel
     */
    this.Then(/^I see "([^"]*)" select box filled with value "([^"]*)"$/, function (selectBox, value, callback) {
        var _this = this;
        var mappedNgModel = context.getCurrentPageInstance().getElementByNgModel(selectBox);

        var elementFinder = element(by.css(mappedNgModel));

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.element(by.css('option[selected=selected]')).getText().then(function getValue(fieldValue) {
                if (fieldValue === value) {
                    _this.delayCallback(callback);
                } else {
                    _this.handleError(fieldValue + " !== " + value, callback);
                }
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
    *  Click on a value on the mapped select box
    */
    this.Then(/^I click on the select box "([^"]*)" to select "([^"]*)"$/, function (selectBox, value, callback) {
        var _this = this;
        var mappedNgModel = context.getCurrentPageInstance().getSelectBoxByNgModel(selectBox);
        var elementFinder = element(by.css(mappedNgModel));

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.click().then(function elementClickSuccess() {
                elementFinder.all(by.css('option')).then(function getOptions(options) {
                  var nbOptions = options.length;
                  var textOptions = '';
                  elementFinder.all(by.css('option')).each(function forEarchOption(option, index) {
                      option.getText().then(function getTextSuccess(textOption){
                          textOptions += "'" + textOption + "', ";
                          if (textOption === value){
                              option.click().then(function elementClickSuccess() {
                                  _this.delayCallback(callback);
                              });
                          }
                          if (index + 1 == nbOptions) {
                            _this.handleError("Not found '" + value + "' value in select box options : " + textOptions, callback);
                          }
                      });
                  }, function allOptionsError(errorMessage){
                      _this.handleError("Not found '" + selectBox + "' select box options", callback);
                  });
                });
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     * Put value for the field
     */
    this.When(/^I fill "([^"]*)" field with "([^"]*)"$/, function (fieldName, fieldValue, callback) {
        var _this = this;

        var fieldIdSelector = context.getCurrentPageInstance().getFieldByName(fieldName);
        var elementFinder = element(by.css(fieldIdSelector));

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.clear().sendKeys(_this.generateValue(fieldValue)).then(function(){
                _this.delayCallback(callback);
            });

        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     * Put value for the timepicker
     */
    this.When(/^I fill "([^"]*)" datepicker with "([^"]*)"$/, function (fieldName, fieldValue, callback) {
        var _this = this;

        var fieldIdSelector = context.getCurrentPageInstance().getFieldByName(fieldName);
        var elementFinder = element(by.css(fieldIdSelector));

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.sendKeys(_this.generateValue(fieldValue)).then(function(){
                _this.delayCallback(callback);
            });

        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     * Check field error message with key translate
     */
    this.Then(/^I see "([^"]*)" error for "([^"]*)" field$/, function (messageName, fieldName, callback) {
        var _this = this;

        var errorMessageTranslateKey = context.getCurrentPageInstance().getErrorMessageByField(fieldName, messageName);

        var fieldSelector = context.getCurrentPageInstance().getFieldByName(fieldName);
        var fieldElementFinder = element(by.css(fieldSelector));

        _this.isPresentAndDisplayed(fieldElementFinder).then(function isPresentAndDisplayedSuccess() {
            fieldElementFinder.getWebElement().findElement(by.xpath('ancestor::div[contains(@class, "form-group")]')).then(function findFormGroupSuccess(formGroupWebElement) {
                formGroupWebElement.findElement(by.css('div[al-error-message][translate-key="' + errorMessageTranslateKey + '"]:not(.ng-hide)')).then(function onErrorMessageFound() {
                    _this.delayCallback(callback);
                }, function onErrorMessageNotFound() {
                    return _this.handleError("Error '" + errorMessageTranslateKey + "' not found for '" + fieldName + "' field. currentPageInstance.url: " + context.getCurrentPageInstance().url, callback);
                });
            }, function findFormGroupError() {
                return _this.handleError("Unable to retrieve formGroup element for '" + fieldName + "' field. currentPageInstance.url: " + context.getCurrentPageInstance().url, callback);
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     *  Check format value
     */
    this.Then(/^I see "([^"]*)" select box values match format "([^"]*)"$/, function (selectBox, format, callback) {
        var _this = this;
        var mappedNgModel = context.getCurrentPageInstance().getElementByNgModel(selectBox);
        var mappedFormat = context.getCurrentPageInstance().getFormatByName(format);
        var elementFinder = element(by.css(mappedNgModel));

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            var formatIsCorrect = true;

            element.all(by.css(mappedNgModel + ' option')).each(function forEachElement(element) {
                element.getText().then(function getValue(value) {
                    if (!new RegExp(mappedFormat).test(value)) {
                        formatIsCorrect = false;
                    }
                });
            });

            if (formatIsCorrect) {
                _this.delayCallback(callback);
            } else {
                _this.handleError("One of the value is incorrectly formated", callback);
            }
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

};
