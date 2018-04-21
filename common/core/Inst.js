export class Inst {
    static _instances  = [];
    static _instancesCls = [];
    static get(cls, id, collection) {
        if (!cls) {
            debugger;
            throw new Error("You can't instantiate null class");
        }
        if (typeof cls == "object") {
            return cls;
        }
        var model;
        if (typeof cls == "string") {
            model = require(cls.replace("/\./g", "/"));
            if (!model) {
                throw new Error("No Model named " + cls);
            }
            else {
                var parts = cls.split('/');
                if (model[parts[parts.length - 1]]) {
                    model = model[parts[parts.length - 1]];
                }
                cls = model;
            }
        }
        var index = this._instancesCls.indexOf(cls);
        if (index != -1) {
            return this._instances[index];
        }
        if (id !== undefined) {
            if (collection) {
                model = Inst.get(collection).getModelByID(id);
                if (model)
                    return model;
            }
            else {
                for (var p in this._instances) {
                    if (this._instances[p] instanceof cls) {
                        model = this._instances[p].getModelByID(id);
                        if (model.constructor === cls) {
                            return model;
                        }
                    }
                }
            }
            model = new cls();
            model.setID(id);
            return model;
        }
        return new cls();
    }
    static register(inst) {
        Inst._instancesCls.push(inst.constructor);
        Inst._instances.push(inst);
    }
}