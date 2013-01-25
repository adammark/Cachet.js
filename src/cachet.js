/*
  Cachet.js v1.0: http://github.com/adammark/Cachet.js
  MIT License
  (c) 2013 Adam Mark
*/
(function () {
    var expiry = {},
        expiry_key = "cachet_expiry",
        Cachet;

    Cachet = {
        isSupported: function () {
            return "localStorage" in window;
        },

        setItem: function (key, val, expires) {
            var storage = localStorage;

            if (val === undefined) {
                return false;
            }

            try {
                if (expires) {
                    if (expires === "session") {
                        storage = sessionStorage;
                    }
                    else {
                        if (typeof expires === "number") {
                            expires = new Date(Date.now() + (expires * 60000));
                        }
                        expiry[key] = expires;
                        storage.setItem(expiry_key, JSON.stringify(expiry));
                    }
                }

                storage.setItem(key, JSON.stringify(val));

                return true;
            }

            // probably a quota exceeded error
            catch (e) {
                console.warn(e);

                return false;
            }
        },

        setItems: function (items, expires) {
            var saved = true, key;

            for (key in items) {
                if (items.hasOwnProperty(key)) {
                    saved = saved && Cachet.setItem(key, items[key], expires);
                }
            }

            return saved;
        },

        getItem: function (key) {
            var val = localStorage.getItem(key);

            if (val === null) {
                val = sessionStorage.getItem(key);
            }

            if (val !== null) {
                if (!expiry[key] || expiry[key] > new Date()) {
                    return JSON.parse(val);
                }
            }

            return undefined;
        },

        getItems: function (keys) {
            var items = {}, i;

            for (i = 0; i < keys.length; i++) {
                items[keys[i]] = Cachet.getItem(keys[i]);
            }

            return items;
        },

        removeItem: function (key) {
            var exists = key in localStorage;

            localStorage.removeItem(key);

            if (expiry[key]) {
                delete expiry[key];

                localStorage.setItem(expiry_key, JSON.stringify(expiry));
            }

            return exists;
        },

        removeItems: function (keys) {
            var removed = true, i;

            for (i = 0; i < keys.length; i++) {
                removed = removed && Cachet.removeItem(keys[i]);
            }

            return removed;
        },

        plus: function (key, n) {
            var val = (Cachet.getItem(key) || 0) + (n || 1);

            if (Cachet.setItem(key, val)) {
                return val;
            }
        },

        minus: function (key, n) {
            var val = (Cachet.getItem(key) || 0) - (n || 1);

            if (Cachet.setItem(key, val)) {
                return val;
            }
        },

        purge: function () {
            var now = new Date(), key;

            for (key in expiry) {
                if (new Date(expiry[key]) < now) {
                    Cachet.removeItem(key);
                }
            }
        }
    };

    expiry = Cachet.getItem(expiry_key) || {};

    window.Cachet = Cachet;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = Cachet;
    }
    else if (typeof define !== "undefined") {
        define(function() {
            return Cachet;
        });
    }

}());
