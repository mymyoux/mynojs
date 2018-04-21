    import { Hardware } from "../../common/env/Hardware";
    import {root} from "../../common/env/Root";
    import localforage from "localforage";
    //TODO:add mozilla API and converts with Promises
    export class FakeLocalStorage {
        /**
         * Constructor
         */
        constructor() {
            // super();
        }
        instance() {
            return this;
        }
        getItem(key) {
            return Promise.resolve(null);
        }
        setItem(key, value) {
            return Promise.resolve(null);
        }
        key(key) {
            return Promise.resolve(null);
        }
        removeItem(key) {
            return Promise.resolve(null);
        }
        clear() {
            return Promise.resolve(null);
        }
        keys() {
            return Promise.resolve([]);
        }
        iterate(func) {
            return Promise.resolve(undefined);
        }
    }
    
    var _log = function () { };
    export class LocalForage {
        static clearAllDebug() {
            //WARNING only used this on chrome for test
            console.warn("WARNING only used this on chrome for test");
            try {
                if (window.indexedDB && window.indexedDB["webkitGetDatabaseNames"]) {
                    window.indexedDB["webkitGetDatabaseNames"]().onsuccess = function (sender, args) {
                        if (!sender || !sender.target || !sender.target.result || !sender.target.result.length) {
                            return;
                        }
                        var len = sender.target.result.length;
                        for (var i = 0; i < len; i++) {
                            console.log("delete: " + sender.target.result[i]);
                            window.indexedDB.deleteDatabase(sender.target.result[i]);
                        }
                    };
                    console.log("all database deleted");
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        static config(options) {
            if (options.debug === true) {
                _log = LocalForage.consolelog;
            }
        }
        static consolelog(...args) {
            console.log(args);
        }
        static instance() {
            if (!LocalForage._instance) {
                LocalForage._instance = new LocalForage({ debug: false });
            }
            return LocalForage._instance;
        }
        constructor(name = "default", config) {
            if (typeof name != "string") {
                config = name;
                name = "default";
            }
            if (config) {
                LocalForage.config(config);
                if (config.name) {
                    name = config.name;
                }
            }
            this._name = name;
            this._warehouses = {};
            if (Hardware.getOS() === 'iOS')
                this._storage = new FakeLocalStorage();
            else
                this._storage = localforage.createInstance({ name: name });
            this._data = {};
            this._sync = {};
            if (false === Hardware.hasCookieEnable()) {
                this._allSync = true;
                this._keys = [];
            }
            else
                this._allSync = false;
        }
        /**
         * Gets forage's name
         * @return {string} Forage's name
         */
        name() {
            return this._name;
        }
        /**
         * Gets Item by key
         * @param key string key
         * @returns {*} Value linked to the key
         */
        getItem(key) {
            var promise = new Promise((resolve, reject) => {
                //no value
                if (!this._allSync && !this._sync[key]) {
                    _log("get item from db:" + key);
                    this._storage.getItem(key).then((value) => {
                        this.sync(key, value);
                        resolve(value);
                    }, reject);
                    return;
                }
                _log("has item from cache:" + key);
                //value already saved
                resolve(this._data[key]);
            });
            return promise;
        }
        sync(key, value, updateKeys = true) {
            _log("sync: " + key + "=", value);
            this._data[key] = value;
            this._sync[key] = true;
            if (this._keys && updateKeys) {
                _log("update keys frmobom " + key);
                var index = this._keys.indexOf(key);
                if (value != null && index == -1) {
                    _log("add key: " + key);
                    this._keys.push(key);
                }
                else if (value == null && index != -1) {
                    this._keys.splice(index, 1);
                    _log("remove key: " + key);
                }
            }
        }
        /**
         * Gets key at the index id
         * @param id
         * @returns {string} key
         */
        key(id) {
            if (this._allSync) {
                return this._keys[id];
            }
            else {
                return this._storage.key(id);
            }
            //TODO: mark as sync key from id
        }
        iterate(func) {
            return new Promise((resolve, reject) => {
                if (this._allSync) {
                    _log("iterate from cache");
                    this._keys.every(function (key, index) {
                        var result = func(this._data[key], key, index + 1);
                        return result === undefined;
                    }, this);
                    resolve();
                    return;
                }
                _log("iterate from db");
                var keys = [];
                this._storage.iterate((value, key, iterationNumber) => {
                    var result = func(value, key, iterationNumber);
                    this.sync(key, value, false);
                    keys.push(key);
                    return result;
                }).then((data) => {
                    if (data === undefined) {
                        this._allSync = true;
                        this._keys = keys;
                        _log("all iterate done - no db anymore");
                    }
                    else {
                        _log("iterate broken - still db");
                        var index;
                        for (var p in keys) {
                            index = this._keys.indexOf(keys[p]);
                            if (index == -1) {
                                this._keys.push(keys[p]);
                            }
                        }
                    }
                    resolve(data);
                }, reject);
            });
        }
        /**
         * Get Keys
         * @returns {Promise<string[]>|string[]|any|*}
         */
        keys() {
            return new Promise((resolve, reject) => {
                if (this._keys) {
                    _log("keys from cache");
                    resolve(this._keys);
                    return;
                }
                _log("keys from db");
                this._storage.keys().then((keys) => {
                    this._keys = keys;
                    resolve(keys);
                }, reject);
            });
        }
        /**
         * Sets an item by key
         * @param key key of the item
         * @param value new item value
         * @returns {void}
         */
        setItem(key, value) {
            this.sync(key, value);
            return this._storage.setItem(key, value);
        }
        /**
         * Removes an item by key
         * @param key key of the item
         * @returns {void}
         */
        removeItem(key) {
            this.sync(key, null);
            return this._storage.removeItem(key);
        }
        /**
         * Clear local storage
         * @returns {void}
         */
        clear() {
            this._data = {};
            this._sync = {};
            this._keys = [];
            this._allSync = true;
            return this._storage.clear();
        }
        //not in the W3C standard
        /**
         * Checks if an item exists with the key given
         * @param key item's key
         * @returns {boolean}
         */
        hasItem(key) {
            var promise = new Promise((resolve, reject) => {
                if (!this._allSync && !this._sync[key]) {
                    _log("has item from db:" + key);
                    //sync is done on getItem
                    this.getItem(key).then(function (data) {
                        resolve(data != null);
                    }, reject);
                    return;
                }
                _log("has item from cache:" + key);
                resolve(this._data[key] != null);
            });
            return promise;
        }
        warehouse(name) {
            return this.war(name);
        }
        war(name) {
            if (!this._warehouses[name]) {
                this._warehouses[name] = new LocalForage(this._name + "/" + name);
            }
            return this._warehouses[name];
        }
    }
    var f = null;
    // export var forage:ghost.data.Foragehouse = new ghost.data.Foragehouse("root");
    if (Hardware.isBrowser()) {
        f = new LocalForage({ debug: false });
    }
    export var forage = f;
    