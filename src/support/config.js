var minimist = require('minimist');

'use strict';

module.exports = function Config() {

    return {
        /**
         * DEV envrionment contant
         * @type {string}
         */
        ENV_DEV: 'dev',

        /**
         * STAGE envrionment contant
         * @type {string}
         */
        ENV_STAGE: 'jenkins',

        /**
         * Delay for callbacks
         * @type {number}
         */
        delay: 5000,

        /**
         * Delay for callbacks
         * @type {number}
         */
        jenkins_delay: 500,

        /**
         * Returns running env
         * @returns {string}
         */
        getEnvironment: function () {
            return this.getArgv('env');
        },

        /**
         * Returns running routing mode (default /#/) can set to html5mode
         * @returns {string}
         */
        getAngularMode: function () {
            return this.getArgv('angularMode') || 'default';
        },

        /**
         * Remove trailing slashes
         * @returns {string}
         */
        keepTrailingSlash: function () {
            return this.getArgv('keepTrailingSlash') || false;
        },

        /**
        * Get argument value in arv
        * @param {string} name of argument
        * @return undefinded if not found or agument value
        */
        getArgv: function(name) {
            var args = minimist(process.argv);

            return args[name];
        },

        /**
         * Returns delay for callbacks
         * @returns {number}
         */
        getDelay: function () {
          if (!this.isDev()) {
            return this.jenkins_delay;
          }

          return this.delay;
        },

        /**
         * Tells if we are in dev env
         * @returns {boolean}
         */
        isDev: function () {
            return this.getEnvironment() === this.ENV_DEV;
        },

        /**
         * Tells if we are in stage env
         * @returns {boolean}
         */
        isStage: function () {
            return !this.isDev();
        }
    };
}();
