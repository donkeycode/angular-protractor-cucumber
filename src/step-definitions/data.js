var context = require('../support/context');

module.exports = function DataSteps() {

    /**
    *  Load backend mockups
    */
    this.Given(/^I use "([^"]*)" mocked database$/, function (mock, callback) {
        var databases = require(process.cwd() + '/test/e2e/support/databases/' + mock);
        databases.initialize();
        context.database = databases;

        this.delayCallback(callback);
    });

};
