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
         * Returns running env
         * @returns {string}
         */
        getEnvironment: function () {
            return this.getArgv('env');
        },

        /**
        * Get argument value in arv
        * @param {string} name of argument
        * @return undefinded if not found or agument value
        */
        getArgv: function(name) {
            var args = minimist(process.argv);

            return args['cucumberOpts'][name];
        },

        /**
         * Returns delay for callbacks
         * @returns {number}
         */
        getDelay: function () {
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
