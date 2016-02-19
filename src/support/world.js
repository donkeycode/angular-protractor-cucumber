var $q = require('q');
var fs = require('fs');
var context = require('./context');
var config = require('./config');
var helperString = require('./helper/string');


module.exports = function () {

    this.World = function World(callback) {

        /**
         * Check if an element is present and visible
         * @param {object} elementFinder
         * @returns {Promise}
         */
        this.isPresentAndDisplayed = function (elementFinder) {
            var deferred = $q.defer();

            elementFinder.isPresent().then(function isPresentSuccess(isPresent) {
                if (isPresent === true) {
                    browser.wait(elementFinder.isDisplayed, 5000).then(function isDisplayedSuccess(isVisible) {
                        if (isVisible === true) {
                            deferred.resolve();
                        } else {
                            deferred.reject("Element is present but not visible. Binding: " + JSON.stringify(elementFinder.locator()) + ", currentPageInstance.url: " + context.getCurrentPageInstance().url);
                        }
                    }, function isDisplayedTimeout() {
                        deferred.reject("Element is present but not visible. Binding: " + JSON.stringify(elementFinder.locator()) + ", currentPageInstance.url: " + context.getCurrentPageInstance().url);
                    });
                } else {
                    deferred.reject("Unable to retrieve element. Binding: " + JSON.stringify(elementFinder.locator()) + ", currentPageInstance.url: " + context.getCurrentPageInstance().url);
                }
            });

            return deferred.promise;
        };

        /**
         * Visit the given page
         * @param {Promise} pageInstancePromise
         * @param {object} params
         * @param {function} callback
         * @returns {exports}
         */
        this.visit = function (pageInstancePromise, params, callback) {
            var _this = this;

            pageInstancePromise.then(function onPageLoaded(pageInstance) {
                var finalUrl = pageInstance.url;
                for (var paramName in params) {
                    finalUrl = finalUrl.replace(new RegExp("/:" + paramName + "/", "g"), "/" + params[paramName] + "/");
                    finalUrl = finalUrl.replace(new RegExp("/:" + paramName + "$", "g"), "/" + params[paramName]);
                }

                if (config.getAngularMode() === 'default') {
                    finalUrl = '#/' + finalUrl;
                }

                browser.get(finalUrl).then(function () {
                    context.setCurrentPageInstance(pageInstance);

                    // we had test-mode class on body for specifics CSS rules (i.e. hide relative footer)
                    browser.executeScript('document.querySelector("body").classList.add("test-mode");').then(function () {
                        _this.isOnPage(pageInstance, callback);
                    });
                });
            });

            return _this;
        };

        /**
         * Validate if we are on the expected page
         * @param pageInstance
         * @param callback
         * @returns {exports}
         */
        this.isOnPage = function (pageInstance, callback) {
            var _this = this;

            browser.getCurrentUrl().then(function (url) {
                var splittedUrl = url.split("/#/");

                if (config.getAngularMode() === 'html5mode') {
                    splittedUrl = url.replace(/:\/\//, '[dash]').split("/");
                }

                var urlReg = new RegExp('^' + pageInstance.url.replace(/:[^\/]+/g, '(.+)').replace(/\//g, '\\/') + '$');

                if (urlReg.test(splittedUrl[1]) === true) {
                    _this.delayCallback(callback);
                } else {
                    _this.handleError("isOnPage fails, pageInstance.url: " + pageInstance.url + ", url: " + url + ", splittedUrl: " + splittedUrl[1] + ", RegExp: " + urlReg.toString(), callback);
                }
            });

            return _this;
        };

        /**
         * Runs callback with a delay on dev environment
         * @param callback
         * @returns {exports}
         */
        this.delayCallback = function (callback) {
            var _this = this;

            if (config.isDev()) {
                setTimeout(callback, config.getDelay());

                return _this;
            }

            callback();

            return _this;
        };

        /**
         * Error handler (take screenshot and call callback.fail())
         * @param error
         * @param callback
         * @returns {exports}
         */
        this.handleError = function (error, callback) {
            var _this = this;

            browser.takeScreenshot().then(function (imageData) {
                var formatFeature = helperString.slugify(context.getCurrentFeature().getName());
                var formatScenario = helperString.slugify(context.getCurrentScenario().getName());

                var token = formatFeature + '_' + formatScenario;
                var path = process.cwd() + '/logs/test/e2e/';

                var pngStream = fs.createWriteStream(path + token + '_screenshot.png');

                pngStream.write(new Buffer(imageData, 'base64'));
                pngStream.end();

                _this.delayCallback(function handleErrorCallback() {
                    callback.fail(new Error(error));
                });
            });

            return _this;
        };

        // tell Cucumber we're finished and to use 'this' as the world instance
        callback();
    };
};
