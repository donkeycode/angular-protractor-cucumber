'use strict';

module.exports = function StringHelper() {
    return {
        /**
         * Returns running env
         * @returns {string}
         */
        slugify: function (string) {
            return string.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
        }
    };
}();
