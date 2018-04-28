export class Form {
    constructor() {
        this.error = {};
        this.globalError = null;
        this.globalMessage = null;
        this._fields = {};
        this._validators = [];
    }
    addInput(name, config) {
        this._fields[name] = config ? config : {};
        this[name] = null;
    }
    addValidator(f) {
        this._validators.push(f);
    }
    validate() {
        this.error = {};
        this.globalError = null;
        this.globalMessage = null;
        var keys = Object.keys(this._fields);
        return new Promise((resolve, reject) => {
            Promise.all(keys.map((name) => this.validateField(name)).concat(this._validators.map((item) => item()))).then((data) => {
                var keys = Object.keys(this.error);
                if (keys.length) {
                    reject(keys);
                }
                else
                    resolve();
            });
        });
    }
    validateField(field) {
        delete this.error[field];
        var config = this._fields[field];
        if (config.required && !this[field]) {
            this.addError(field, 'required');
        }
        return true;
    }
    setGlobalError(message) {
        this.globalError = message;
    }
    setGlobalMessage(message) {
        this.globalMessage = message;
    }
    addError(field, message) {
        this.error[field] = message;
    }
    getFields() {
        return Object.keys(this._fields);
    }
    getValues() {
        var object = {};
        for (var p in this) {
            if (typeof this[p] == "function")
                continue;
            if (["error", "_fields"].indexOf(p) != -1)
                continue;
            object[p] = this[p];
        }
        //default values
        for (var q in this._fields) {
            if (this._fields[q].default && !object[q]) {
                object[q] = this._fields[q].default;
            }
        }
        return object;
    }
}