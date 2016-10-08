'use strict';

var glob = require("glob");
var $q = require("q");

module.exports = function Context() {
    return {
        /**
         * Current page instance
         * @type {object}
         */
        currentPageInstance: null,

        /**
         * Current running feature
         * @type {object}
         */
        currentFeature: null,

        /**
         * Current running scenario
         * @type {object}
         */
        currentScenario: null,

        /**
         * Current running step
         * @type {object}
         */
        currentStep: null,

        /**
         * Httpbackend
         * @type {object}
         */
        database: null,

        /**
         * Returns an instance of the given page
         * @param pageName
         * @returns {Promise} success(pageInstance), error(pageNotFoundMessage)
         */
        loadPageInstance: function (pageName) {
            var deffered = $q.defer();
            glob(process.cwd() + '/test/e2e/support/pages/**/' + pageName+".js", {}, function (er, files) {
                if (files.length === 0) {
                    deffered.reject("Page "+pageName+" not found !");

                    throw "Page "+pageName+" not found !";
                }

                var p = require(files[0]);

                deffered.resolve(p);
            });

            return deffered.promise;
        },

        /**
         * Returns current page instance
         * @returns {Object|context.currentPageInstance|*}
         */
        getCurrentPageInstance: function () {
            return this.currentPageInstance;
        },

        /**
         * Set current page instance
         * @param pageInstance
         * @returns {exports}
         */
        setCurrentPageInstance: function (pageInstance) {
            this.currentPageInstance = pageInstance;

            return this;
        },

        /**
         * Returns current running feature
         * @returns {Object|context.currentFeature|*}
         */
        getCurrentFeature: function () {
            return this.currentFeature;
        },

        /**
         * Set current running feature
         * @param feature
         * @returns {exports}
         */
        setCurrentFeature: function (feature) {
            this.currentFeature = feature;

            return this;
        },

        /**
         * Returns current running scenario
         * @returns {Object|context.currentScenario|*}
         */
        getCurrentScenario: function () {
            return this.currentScenario;
        },

        /**
         * Set current running scenario
         * @param scenario
         * @returns {exports}
         */
        setCurrentScenario: function (scenario) {
            this.currentScenario = scenario;

            return this;
        },

        /**
         * Returns current running step
         * @returns {Object|context.currentStep|*}
         */
        getCurrentStep: function () {
            return this.currentStep;
        },

        /**
         * Set current running step
         * @param step
         * @returns {exports}
         */
        setCurrentStep: function (step) {
            this.currentStep = step;

            return this;
        }
    };
}();
