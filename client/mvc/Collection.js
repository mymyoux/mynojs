import { Model, ModelLoadRequest } from "./Model";
import { Objects } from "../../common/utils/Objects";
import { Inst } from "../../common/core/Inst";
import { Arrays } from "../../common/utils/Arrays";
export function Collection(A) {
    return _a = class _Collection extends A {
            constructor(...args) {
                super(...args);
                this.models = [];
                this._modelClass = A; //eval('_super');
                this.models = [];
            }
            isFullLoaded() {
                var apiData = this.request().getAPIData();
                if (apiData && apiData.paginate && apiData.paginate.full)
                    return true;
                return false;
            }
            createModel() {
                return new this._modelClass();
            }
            isSameCollection(collection) {
                return collection._modelClass === this._modelClass;
            }
            clear() {
                this._request = null;
                this.clearModels();
            }
            resetPaginate() {
                this.request().reset();
            }
            reset() {
                this.clear();
                this.resetPaginate();
            }
            getRootPath() {
                return super.getModelName();
            }
            getModelName() {
                if (!this._modelName) {
                    var name = super.getModelName();
                    name = name.replace('collection', '').toLowerCase();
                    if (typeof this == "function")
                        return name + (name.substr(-1, 1) == "s" ? "" : "s");
                    this._modelName = name;
                }
                return this._modelName + (this._modelName.substr(-1, 1) == "s" ? "" : "s");
            }
            clearModels() {
                this.models = [];
            }
            remove(model) {
                var index = this.models.indexOf(model);
                if (index != -1) {
                    this.models.splice(index, 1);
                }
                return model;
            }
            getModel(index) {
                return this.models[index];
            }
            getModelByID(id) {
                for (var p in this.models) {
                    if (this.models[p].getID() == id)
                        return this.models[p];
                }
                for (var p in this.models) {
                    if (this.models[p].isSameCollection && this.models[p].isSameCollection(this)) {
                        var model = this.models[p].getModelByID(id);
                        if (model) {
                            return model;
                        }
                    }
                }
                return null;
            }
            first() {
                return this.models.length ? this.models[0] : null;
            }
            last() {
                return this.models.length ? this.models[this.models.length - 1] : null;
            }
            pop() {
                return this.models.pop();
            }
            push(...models) {
                return this.models.push(...models);
            }
            reverse() {
                return this.models.reverse();
            }
            shift() {
                return this.models.shift();
            }
            sort(compareFunction) {
                return this.models.sort(compareFunction);
            }
            splice(index, howMany, ...models) {
                return this.models.splice(index, howMany, ...models);
            }
            unshift(...models) {
                return this.models.unshift(...models);
            }
            size() {
                return this.models.length;
            }
            empty() {
                return this.size() == 0;
            }
            concat(...models) {
                var cls = this.constructor;
                var collection = new cls();
                collection.models = this.models;
                collection.push(...models);
                return collection;
            }
            slice(begin, end) {
                return this.models.slice(begin, end);
            }
            indexOf(model) {
                return this.models.indexOf(model);
            }
            lastIndexOf(model) {
                return this.models.lastIndexOf(model);
            }
            forEach(callback, thisArg) {
                return this.models.forEach(callback, thisArg);
            }
            every(callback, thisObject) {
                return this.models.every(callback, thisObject);
            }
            some(callback, thisObject) {
                return this.models.some(callback, thisObject);
            }
            filter(callback, thisObject) {
                return this.models.filter(callback, thisObject);
            }
            map(callback, thisObject) {
                return this.models.map(callback, thisObject);
            }
            reduce(callback, initialValue) {
                return this.models.reduce(callback, initialValue);
            }
            toArray() {
                return this.splice();
            }
            _path(path) {
                var path = super._path(path);
                return path.replace('collection', '');
            }
            unselect() {
                for (var p in this.models) {
                    if (this.models[p].models) {
                        for (var q in this.models[p].models) {
                            this.models[p].models[q].selected = false;
                        }
                    }
                    else {
                        this.models[p].selected = false;
                    }
                }
                return this;
            }
            request(config) {
                if (!this._request) {
                    if (!config)
                        config = {};
                    var tmp;
                    config.execute = false;
                    this._request = this.load(this.constructor["PATH_GET"], null, config);
                    config.execute = tmp;
                    
                   //TODO:check this
                    //this._request.on(API2.EVENT_DATA, this.prereadExternal, this, this._request.getPath(), this._request);
                }
                var path = this.constructor["PATH_GET"];
                if (typeof path == "function")
                    path = path();
                var params = {};
                if (path.params) {
                    for (var p in path.params) {
                        if (params[p] == undefined)
                            params[p] = path.params[p];
                    }
                    path = path.path;
                }
                if (this._request["model_config"].replaceDynamicParams) {
                    path = this.replace(path);
                    if (params) {
                        var k;
                        for (var p in params) {
                            if (Model.regexp.test(params[p])) {
                                params[p] = this.replace(params[p]);
                                if (params[p] == "undefined") {
                                    delete params[p];
                                }
                            }
                            if (Model.regexp.test(p)) {
                                k = this.replace(p);
                                if (k != p) {
                                    params[k] = params[p];
                                    delete params[p];
                                }
                            }
                        }
                    }
                }
                for (var p in params) {
                    if (!this._request.hasParam(p))
                        this._request.param(p, params[p]);
                }
                return this._request;
            }
            async loadGet(params, config) {
                var tmp = config;
                var request = this.request(config);
                if (tmp) {
                    config = Objects.clone(request["model_config"]);
                    for (var p in tmp)
                        config[p] = tmp[p];
                }
                else {
                    config = request["model_config"];
                }
                // if(!request.hasNoPaginate() && this._pathLoaded[request.getPath()] && (!config || config.ignorePathLoadState !== true))
                // {
                //     if(typeof this._pathLoaded[request.getPath()] != "boolean" && !this._pathLoaded[request.getPath()].done)
                //     {
                //         try{
                //             await this._pathLoaded[request.getPath()];
                //         }catch(error)
                //         {
                //             //if request failed or been cancelled
                //         }
                //     }
                // }
                if (request.hasNoPaginate()) {
                    if (this._pathLoaded[request.getPath()] && config.ignorePathLoadState !== true) {
                        var promise = this._pathLoaded[request.getPath()];
                        if (!promise || typeof promise == "boolean") {
                            promise = new Promise((resolve, reject) => {
                                resolve();
                            }).then(function () { });
                        }
                        return promise;
                    }
                }
                else {
                    //useful if two calls are made before one gets a result so we don't know if there is any paginate
                    if (this._pathLoaded[request.getPath()] && (!config || config.ignorePathLoadState !== true)) {
                        if (typeof this._pathLoaded[request.getPath()] != "boolean") {
                            try {
                                await this._pathLoaded[request.getPath()];
                            }
                            catch (error) {
                                //if request failed or been cancelled
                            }
                        }
                    }
                }
                for (var key in params) {
                    request.param(key, params[key]);
                }
                if (config.removePreviousModels) {
                    this.models = [];
                }
                var promise = request.then((data) => {
                    return data;
                });
                if (config.execute === false) {
                    return request;
                }
                if (config.marksPathAsLoaded !== false) {
                    this._pathLoaded[request.getPath()] = promise;
                }
                return promise;
            }
            prereadExternal(data, ...args) {
                if (data && data.data)
                    data = data.data;
                this.readExternal(data, ...args);
            }
            readExternal(input, path, api) {
                if (!input)
                    return;
                if (input["data"]) {
                    input = input["data"];
                }
                if (!Arrays.isArray(input)) {
                    //readExternal for collection like models
                    if (!path || path.allowNoArray === true) {
                        var data = input;
                        input = input["models"];
                        delete data.models;
                        super.readExternal(data);
                    }
                    else {
                        input = [input];
                    }
                }
                if (input) {
                    if (!input.length || !input.forEach) {
                        //needed to not break the flow
                        this.triggerFirstData();
                        this._trigger(this.constructor["EVENT_FORCE_CHANGE"]);
                        return;
                    }
                    input.forEach(function (rawModel) {
                        if (!rawModel) {
                            return;
                        }
                        if (rawModel.__class) {
                            //TODO:check id too
                            var model = Inst.get(rawModel.__class);
                            this.prepareModel(model);
                            model.readExternal(rawModel);
                            this.postModel(model);
                            this.push(model);
                        }
                        else {
                            if (typeof rawModel == "object") {
                                var cls = this._modelClass; //A;
                                var model;
                                if (rawModel) {
                                    if (this['__isUnique']) {
                                        if (rawModel && rawModel.id != undefined) {
                                            model = this.getModelByID(rawModel.id);
                                        }
                                        else {
                                            var id = this.getIDName();
                                            if (rawModel[id]) {
                                                model = this.getModelByID(rawModel[id]);
                                            }
                                        }
                                    }
                                }
                                //TODO:handle unique/sort collections
                                if (!model) {
                                    if (rawModel && rawModel.models) {
                                        model = Inst.get(Collection(cls));
                                    }
                                    else {
                                        //TODO: this createModel ?
                                        //model  = Inst.get(cls);
                                        model = this.createModel();
                                    }
                                    this.prepareModel(model);
                                    model.readExternal(rawModel);
                                    this.postModel(model);
                                    this.push(model);
                                }
                                else {
                                    //TODO:transform existing model into collection if rawModel.models exists
                                    this.prepareModel(model);
                                    model.readExternal(rawModel);
                                    this.postModel(model);
                                }
                            }
                            else {
                                console.error("RawModel must be object, given ", rawModel);
                            }
                        }
                    }, this);
                    this.triggerFirstData();
                    this._trigger(this.constructor["EVENT_FORCE_CHANGE"]);
                }
            }
            prepareModel(model) {
            }
            postModel(model) {
            }
            next(quantity) {
                var request = this.request();
                return request.next(quantity);
            }
            nextAll(quantity) {
                var request = this.request();
                return request.nextAll(quantity);
            }
            previous(quantity) {
                var request = this.request();
                return request.previous(quantity);
            }
            previousAll(quantity) {
                var request = this.request();
                return request.previousAll(quantity);
            }
        },
        _a.PATH_GET = () => new ModelLoadRequest("%root-path%/list", { '%id-name%': '%id%' }, { replaceDynamicParams: true }),
        _a;
    var _a;
}
export function Unique(Model) {
    return class Unique extends Model {
        constructor() {
            super(...arguments);
            this.__isUnique = true;
            this.models = [];
            this._unicity = [];
            this._keys = [];
        }
        unicity(key) {
            if (!Arrays.isArray(key)) {
                key = [key];
            }
            this._unicity = key;
            if (this.models.length) {
                this._buildKeys();
            }
        }
        clear() {
            super["clear"]();
            this._buildKeys();
        }
        _buildKeys() {
            this._keys = [];
            for (let model of this.models) {
                this._keys.push(this._getUnicityKey(model));
            }
        }
        _hasUnicity() {
            return this._unicity && this._unicity.length > 0;
        }
        _registerKey(model) {
            if (!this._hasUnicity())
                return;
            var index = this.models.indexOf(model);
            this._keys.splice(index, 0, this._getUnicityKey(model));
        }
        indexOf(model) {
            if (this._hasUnicity()) {
                var key = this._getUnicityKey(model);
                return this._keys.indexOf(key);
            }
            return this.models.indexOf(model);
        }
        lastIndexOf(model) {
            if (this._hasUnicity()) {
                var key = this._getUnicityKey(model);
                return this._keys.lastIndexOf(key);
            }
            return this.models.lastIndexOf(model);
        }
        _getUnicityKey(model) {
            if (this._unicity.length == 1) {
                if (typeof model[this._unicity[0]] == "function") {
                    return model[this._unicity[0]]();
                }
                return model[this._unicity[0]];
            }
            else {
                return this._unicity.map(function (key) {
                    return model[key];
                }).join('-');
            }
        }
        push(...models) {
            var index;
            var model;
            for (var p in models) {
                model = models[p];
                if ((index = this.indexOf(model)) == -1) {
                    super["push"](model);
                    this._registerKey(model);
                }
            }
            return this.models.length;
        }
        unshift(...models) {
            var index;
            var model;
            for (var p in models) {
                model = models[p];
                if ((index = this.indexOf(model)) == -1) {
                    super["unshift"](model);
                    this._registerKey(model);
                }
            }
            return this.models.length;
        }
        splice(index, howMany, ...models) {
            var id;
            var model;
            var modelsToSplice = [];
            for (var p in models) {
                model = models[p];
                //TODO:check borns
                if ((id = this.indexOf(model)) == -1 || id < index || id > index + howMany) {
                    modelsToSplice.push(model);
                }
            }
            var result = super["splice"](index, howMany, ...modelsToSplice);
            this._keys.splice(index, howMany);
            for (var model of models) {
                this._registerKey(model);
            }
            return result;
        }
        remove(model) {
            var index = this.models.indexOf(model);
            if (index != -1) {
                this.models.splice(index, 1);
                this._keys.splice(index, 1);
            }
            return model;
        }
        pop() {
            this._keys.pop();
            return this.models.pop();
        }
        shift() {
            this._keys.shift();
            return this.models.shift();
        }
        sort(compareFunction) {
            var result = super["sort"](compareFunction);
            this._buildKeys();
            return result;
        }
    };
}
export function Sorted(Model) {
    return class Sorted extends Model {
        constructor(...args) {
            super(...args);
            this.__isSorted = true;
            if (this["__isUnique"] === true) {
                throw new Error('Unique Mixin must be used before Sorted mixin');
            }
        }
        push(...models) {
            var index;
            var model;
            for (var p in models) {
                model = models[p];
                if (!this.models.length) {
                    super["push"](model);
                    continue;
                }
                if ((index = this.models.indexOf(model)) == -1) {
                    //if list ordonned
                    if (this._order) {
                        var result = Arrays.binaryFindArray(this.models, model, this._order, this._orderDirection);
                        if (result.index == undefined) {
                            //handle order
                            if (result.order > 0) {
                                super["push"](model);
                            }
                            else {
                                super["unshift"](model);
                            }
                        }
                        else {
                            super["splice"](result.index, 0, model);
                        }
                    }
                    else {
                        super["push"](model);
                    }
                }
                else {
                    console.warn("already into collection:", model);
                }
            }
            return this.models.length;
        }
        unshift(...models) {
            if (this._order)
                return this.push(...models);
            return super["unshift"](...models);
        }
        splice(index, howMany, ...models) {
            if (!this._order)
                return super["unshift"](...models);
            var splicedModels = super["splice"](index, howMany);
            this.push(...models);
            return splicedModels;
        }
        sort(compareFunction) {
            throw new Error('you must not use sort function in sorted collection - use .order() instead');
        }
        order(order, direction = 1) {
            this._order = (Arrays.isArray(order) ? order : [order]);
            this._orderDirection = (Arrays.isArray(direction) ? direction : [direction]);
            while (this._orderDirection.length < this._order.length) {
                this._orderDirection.push(this._orderDirection[this._orderDirection.length - 1]);
            }
            if (this.models.length) {
                super["sort"]((modelA, modelB) => {
                    for (var i = 0; i < this._order.length; i++) {
                        if (modelA[this._order[i]] > modelB[this._order[i]] || (modelA[this._order[i]] != null && modelB[this._order[i]] == null)) {
                            return this._orderDirection[i] > 0 ? -1 : 1;
                        }
                        if (modelA[this._order[i]] < modelB[this._order[i]] || (modelB[this._order[i]] != null && modelA[this._order[i]] == null)) {
                            return this._orderDirection[i] > 0 ? 1 : -1;
                        }
                    }
                    return 0;
                });
            }
            
        }
        detectedFullLoad(api) {
            if (!api) {
                return;
            }
            var apidata = api.getAPIData();
            var request;
            if (api) {
                request = api.getLastRequest();
            }
            if (request && request.data && request.data.paginate && request.data.paginate.direction != undefined && request.data.paginate.key) {
                if (Objects.deepEquals(this._order, request.data.paginate.key) && Objects.deepEquals(this._orderDirection, request.data.paginate.direction)) {
                    if (apidata && apidata.paginate && apidata.paginate.limit && length < apidata.paginate.limit) {
                        if (request.data.paginate.next || (!request.data.paginate.next && !request.data.paginate.previous)) {
                            this._isFullLoaded = true;
                        }
                    }
                }
            }
        }
        request() {
            var request = super["request"]();
            if (this._order && !this._orderDirection) {
                this._orderDirection = [];
                while (this._orderDirection.length < this._order.length) {
                    this._orderDirection.push(-1);
                }
            }
            if (this._order)
                request.order(this._order, this._orderDirection);
            return request;
        }
    };
}