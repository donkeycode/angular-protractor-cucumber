var context = require('./context');

module.exports = function Hooks() {

    this.BeforeFeature(function (event, callback) {
        context.setCurrentFeature(event.getPayloadItem('feature'));

        callback();
    });

    /**
     * Clear database if mocked with HttpBackend
     */
    this.AfterFeature(function (event, callback) {
        if (context.database) {
            context.database.clear();
            context.database = null;
        }

        callback();
    });

    this.BeforeScenario(function (event, callback) {
        context.setCurrentScenario(event.getPayloadItem('scenario'));

        callback();
    });

    this.BeforeStep(function (event, callback) {
        context.setCurrentStep(event.getPayloadItem('step'));

        callback();
    });
};
