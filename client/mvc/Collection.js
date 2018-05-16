import { Model, ModelLoadRequest } from "./Model";
import { Objects } from "../../common/utils/Objects";
import { Inst } from "../../common/core/Inst";
import { Arrays } from "../../common/utils/Arrays";
import { API } from "../io/API";
export function Collection(A) {
    return _a = class _Collection extends A {
            constructor(...args) {
                super(...args);
                // Object.defineProperty(this, "models", {
                //     enumerable: false,
                //     writable:true
                // });
                Object.defineProperty(this, "_modelClass", {
                    enumerable: false,
                    writable:true
                });
                Object.defineProperty(this, "_modelName", {
                    enumerable: false,
                    writable:true
                });
           
                Object.defineProperty(this, "_request", {
                    enumerable: false,
                    writable:true
                });
           
                Object.defineProperty(this, "_paginate", {
                    enumerable: false,
                    writable:true
                });
                Object.defineProperty(this, "_limit", {
                    enumerable: false,
                    writable:true
                });
                this.models = [];
                this._modelClass = A; //eval('_super');
                this._paginate = {};
                this._limit = null;
            }
            *[Symbol.iterator]()
            {
                let i = 0;
                while(i<this.models.length)
                {
                    yield this.models[i++];
                }
            }
            // get [Symbol.toStringTag]()
            // {
            //     return this._modelClass.name.replace(/Model/,'Collection').kprZ7jGm;
            // }
            hasNext() {
                throw new Error('not implemented');
                //return this.request().hasNext();

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
                if(this._request)
                {
                    this._request.resetForPaginate();
                    this._request.resetPaginate();
                }
                return this;
            }
            reset() {
                this.clear();
                this.resetPaginate();
                return this;
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


            async loadGet(params, config)
            {
                if(!config)
                {
                    config = {};
                }
                let path = this.constructor["PATH_GET"];
                if (typeof path == "function") {
                    path = path.call(this);
                }
                if (typeof params == "function") {
                    params = params.call(this);
                }
                if (path instanceof ModelLoadRequest) {
                    if (path.config) {
                        for (var p in path.config) {
                            if (config[p] == undefined)
                                config[p] = path.config[p];
                        }
                    }
                }
                config = Objects.assign({
                    removePreviousModels:false,
                    readExternal:true
                }, config);

                if(this._request)
                {
                    await this._request;
                   // this._request.reset();
                }



                if(!this._request)
                {
                    this._request = this.request(config);
                }else
                {
                    if(config.removePreviousModels)
                    {
                        this._request.reset();
                        let tmp = this.request(config);
                        this._request._request.params = tmp._request.params;
                    }
                }
               
                if(params)
                    this._request.params(params);
                if(this._request._executed)
                {
                    return this._request;
                }
                return this._request.then((data)=>
                {
                    if(config.removePreviousModels)
                    {
                        this.clearModels();
                    }
                    if(config.readExternal)
                    {
                        this.readExternal(data);
                    }
                    return data;
                });
            }
            limit(quantity)
            {
                this._limit = quantity;
                if(this._request)
                    this._request.limit(quantity);
                return this;
            }
            async next(quantity)
            {
                if(!this._request)
                {
                    throw new Error('you can\'t next a non initialized collection');
                }
                await this._request;
                if(quantity)
                {
                    this._request.limit(quantity);
                }


                return this._request.next().then((data)=>
                {
                    if(config.readExternal)
                    {
                        this.readExternal(data);
                    }
                    return data;
                });
            }
            async nextAll(quantity)
            {
                if(!this._request)
                {
                    throw new Error('you can\'t next-all a non initialized collection');
                }
                await this._request;
                if(quantity)
                {
                    this._request.limit(quantity);
                }

                return this._request.nextAll().then((data)=>
                {
                    if(config.readExternal)
                    {
                        this.readExternal(data);
                    }
                    return data;
                });
            }
            async previous(quantity)
            {
                if(!this._request)
                {
                    throw new Error('you can\'t previous a non initialized collection');
                }
                await this._request;
                if(quantity)
                {
                    this._request.limit(quantity);
                }

                return this._request.previous().then((data)=>
                {
                    if(config.readExternal)
                    {
                        this.readExternal(data);
                    }
                    return data;
                });
            }
            async loading()
            {
                if(!this._request)
                    return null;
                return await this._request;
            }
            async previousAll(quantity)
            {
                if(!this._request)
                {
                    throw new Error('you can\'t previous-all a non initialized collection');
                }
                await this._request;
                if(quantity)
                {
                    this._request.limit(quantity);
                }

                return this._request.previousAll().then((data)=>
                {
                    if(config.readExternal)
                    {
                        this.readExternal(data);
                    }
                    return data;
                });
            }






            _path(path) {
                var path = super._path(path);
                return path.replace('collection', '');
            }
            request(config) {

                config.execute = false;

                let request =  this.load(this.constructor["PATH_GET"], null, config);

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
                if (request["model_config"].replaceDynamicParams) {
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
                    if (!request.hasParam(p))
                        request.param(p, params[p]);
                }
                if(this._limit)
                {
                    request.limit(this._limit);
                }
                return request;
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
                }
            }
            prepareModel(model) {
            }
            postModel(model) {
            }
          
        },
        _a.PATH_GET = () => new ModelLoadRequest("%root-path%/list", {}, { replaceDynamicParams: true }),
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
        _hasParamUnicity() {
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
            if (request && request.data && request.paginate && request.paginate.direction != undefined && request.paginate.key) {
                if (Objects.deepEquals(this._order, request.paginate.key) && Objects.deepEquals(this._orderDirection, request.paginate.direction)) {
                    if (apidata && apipaginate && apipaginate.limit && length < apipaginate.limit) {
                        if (request.paginate.next || (!request.paginate.next && !request.paginate.previous)) {
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