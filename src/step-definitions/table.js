var context = require('../support/context');

module.exports = function TableSteps() {
    this.Then(/^I can see "([^"]*)" for the first "([^"]*)" data$/, function(valueName, repeaterName, callback) {
        var _this = this;
        valueName = _this.generateValue(valueName);

        var objectData = context.getCurrentPageInstance().getTableByRepeater(repeaterName);
        var searchBy = by.repeater(objectData.ngRepeat).row(0).column(objectData.columnKey);
        var firstData = element(searchBy);
        _this.isPresentAndDisplayed(firstData).then(function isPresentAndDisplayedSuccess() {
            firstData.getText().then(function getTextSuccess(textFirstData) {
                if (textFirstData == valueName) {
                    _this.delayCallback(callback);
                } else {
                    _this.handleError("Doesn't match between " + valueName + " and first data text (" + firstData + ")", callback);
                }

            }, function getTextError(error) {
                _this.handleError("Doesn't find first data text " + firstData + " - " + error, callback);
            });

        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError("Doesn't find first data " + firstData + " - " + errorMessage, callback);
        });
    });

    /*
     * Check a value in a table
     */
    this.Then(/^I see "([^"]*)" in the column "([^"]*)" of the row "([^"]*)" of the table "([^"]*)"$/, function (valueToMatch, columnToSearch, line, table, callback) {
        _this = this;
        valueToMatch = _this.generateValue(valueToMatch);

        var mappedTable = context.getCurrentPageInstance().getTableByRepeater(table);
        var mappedColumn = context.getCurrentPageInstance().getColumnByName(columnToSearch);

        var row = element(by.repeater(mappedTable).row(line - 1));

        if (row.isPresent()) {
            var column = row.all(by.css('td')).get(mappedColumn - 1);

            if (column.isPresent()) {
                column.getText().then(function getValue(value) {
                    if (value === valueToMatch) {
                        _this.delayCallback(callback);
                    } else {
                        _this.handleError("Value mismatch : " + value + " / " + valueToMatch, callback);
                    }
                });
            } else {
                _this.handleError("Column is not present", callback);
            }
        } else {
            _this.handleError("Row is not present", callback);
        }

    });

    /*
     * Click on an action button in a table
     */
    this.When(/^I click on the action "([^"]*)" of the row "([^"]*)" of the table "([^"]*)"$/, function (action, line, table, callback) {
        _this = this;

        var mappedTable = context.getCurrentPageInstance().getTableByRepeater(table);
        var mappedColumn = context.getCurrentPageInstance().getColumnByName("actions");
        var mappedAction = context.getCurrentPageInstance().getActionByClassName(action);

        var row = element(by.repeater(mappedTable).row(line - 1));
        if (row.isPresent()) {
            var column = row.all(by.css('td')).get(mappedColumn - 1);

            if (column.isPresent()) {
                column.element(by.className(mappedAction)).click();
                _this.delayCallback(callback);
            } else {
                _this.handleError("Column is not present", callback);
            }
        } else {
            _this.handleError("Row is not present", callback);
        }
    });

};
