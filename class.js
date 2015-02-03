(function() {
    "use strict";

    var Class = function(obj) {
        obj = obj || {};
        var fn = function() {};

        var merge = function(source, key, obj) {
            // we have a key/value pair
            if (typeof key === 'string') {
                source[key] = obj;

                return source;
            }

            // we have n objects
            for (var i = 1, l = arguments.length; i < l; i++) {
                var o = arguments[i];

                for (var k in o) {
                    source = merge(source, k, o[k]);
                }
            }

            return source;
        };

        var clone = function(original) {
            if (original instanceof Array) {
                var i = original.length,
                    cloned = new Array(i);

                while (i--) cloned[i] = clone(original[i]);
            } else if (typeof original === 'object') {
                var cloned = {};

                for (var key in original) {
                    if (original.hasOwnProperty(key)) {
                        clone[key] = clone(original[key]);
                    }
                }
            } else {
                var cloned = original;
            }

            return cloned;
        };

        // Add Constructor then removes it from arguments
        if (obj.Constructor && typeof obj.Constructor === 'function')
            fn = obj.Constructor

        delete obj.Constructor;

        // Build inheritance from Extends property
        if (obj.Extends !== undefined) {
            if (typeof obj.Extends !== 'function')
                throw new Error('parent is not a function');

            // Clones parent prototype
            var cloned = clone(obj.Extends.prototype);
            delete cloned.Super;

            // Merge parent prototype
            fn.prototype = merge(fn.prototype, cloned);
            fn.prototype['Super'] = obj.Extends;

            delete obj.Extends;
        }

        // Merge object properties and methods
        fn.prototype = merge(fn.prototype, obj);

        return fn.bind(fn);
    }

    if (typeof define !== 'undefined')
        define(function () { return Class; });
    else if (typeof module !== 'undefined')
        module.exports = Class;
    else window.Class = Class;
})();
