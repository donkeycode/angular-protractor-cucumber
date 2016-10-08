var context = require('./context');

module.exports = function Hooks() {

    this.registerHandler('BeforeFeature', function (feature, callback) {
        context.setCurrentFeature(feature);

        callback();
    });

    /**
     * Clear database if mocked with HttpBackend
     */
    this.registerHandler('AfterFeature', function (feature, callback) {
        if (context.database) {
            context.database.clear();
            context.database = null;
        }

        callback();
    });

    this.registerHandler('BeforeScenario', function (scenario, callback) {
        context.setCurrentScenario(scenario);

        callback();
    });

    this.registerHandler('BeforeStep', function (step, callback) {
        context.setCurrentStep(step);

        callback();
    });
};
