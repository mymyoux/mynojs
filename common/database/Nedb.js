import  Datastore from "nedb";
import { Promise } from "bluebird";
import { Objects } from "../utils/Objects";

export class Nedb
{
    static _dbs = {};
    static register(name, options)
    {
        
        Nedb._dbs[name] = new Proxy(new this(name, options), proxified);
        Object.defineProperty(this, name, { get: function() { return Nedb._dbs[name] } });
        return Nedb._dbs[name].boot();
    }
    _db = null;
    _name;
    _options;
    constructor(name, options)
    {
        this._name = name;
        this._options = Objects.assign({timestampData:true}, options?options:{});
        
    }
    boot()
    {
        this._db = new Datastore(this._options);
        return new Promise((resolve, reject)=>
        {
            this._db.loadDatabase((error)=>
            {
                if(error)
                {
                    reject(error);
                }else
                {
                    resolve(this);
                }
            });
        });
    }
    ensureIndex(options)
    {
        return new Promise((resolve, reject)=>
        {
            this._db.ensureIndex(options, (errors)=>
            {
                if(errors)
                {
                    reject(errors);
                }else{
                    resolve();
                }

            });
        });
    }
    removeIndex(options)
    {
        return new Promise((resolve, reject)=>
        {
            this._db.removeIndex(options, (errors)=>
            {
                if(errors)
                {
                    reject(errors);
                }else{
                    resolve();
                }

            });
        });
    }
    insert(record)
    {
        return new Promise((resolve, reject)=>
        {
            this._db.insert(record, (errors, newDoc)=>
            {
                if(errors)
                {
                    reject(errors);
                }else{
                    resolve(newDoc);
                }

            });
        });
    }
    upsert(record)
    {
        if(record._id)
        {
            return this.update({_id:record._id},record).then((data)=>
            {
                if(data.upsert)
                {
                    return data.upsert;
                }
                return record;
            })
        }
        return this.insert(record);
    }
    count(filter)
    {
        if(!filter)
        {
            filter = {};
        }
        return new Promise((resolve, reject)=>
        {
            this._db.count(filter, (errors, count)=>
            {
                if(errors)
                {
                    reject(errors);
                }else{
                    resolve(count);
                }

            });
        });
    }
    update(query, update, options)
    {
        if(!options)
        {
            options = {};
        }
        return new Promise((resolve, reject)=>
        {
            this._db.update(query, update, options, (errors, numAffected, affectedDocuments, upsert)=>
            {
                if(errors)
                {
                    reject(errors);
                }else{
                    resolve({numAffected,affectedDocuments,upsert});
                }

            });
        });
    }
    remove(query, options)
    {
        return new Promise((resolve, reject)=>
        {
            options = Objects.assign({},options);
            this._db.remove(query, options, (errors, numRemoved)=>
            {
                if(errors)
                {
                    reject(errors);
                }else{
                    resolve(numRemoved);
                }

            });
        });
    }
    /**
     * db.find({}).sort({ planet: 1 }).skip(1).limit(2).exec(function (err, docs) {
  // docs is [doc3, doc1]
});

     */
    find(query, projection)
    {
        if(!query)
        {
            query = {};
        }
        let object = this._db;

        let resolve, reject;
        let promise = new Promise((r, f)=>
        {
            resolve = r;
            reject = f;
        });

        let instance = this;


        let cursor =  {
            then(r, f)
            {
                cursor.then = promise.then;

                if(object === instance._db)
                {
                    instance._db.find(query, projection, (errors, docs)=>
                    {
                        if(errors)
                        {
                            reject(errors);
                        }else
                        {
                            resolve(docs);
                        }
                    });
                }else
                {
                    object.exec((errors, docs)=>
                    {
                        if(errors)
                        {
                            reject(errors);
                        }else
                        {
                            resolve(docs);
                        }
                    });
                }
                return promise.then(r, f);
                
            },
            sort(options)
            {
                if(object === instance._db)
                {
                    object = instance._db.find(query, projection)
                }
                object = object.sort(options);

                return cursor;
            },
            projection(options)
            {
                if(object === instance._db)
                {
                    object = instance._db.find(query, projection)
                }
                object = object.projection(options);

                return cursor;
            },
            skip(num)
            {
                if(object === instance._db)
                {
                    object = instance._db.find(query, projection)
                }
                object = object.skip(num);

                return cursor;
            },
            limit(num)
            {
                if(object === instance._db)
                {
                    object = instance._db.find(query, projection)
                }
                object = object.limit(num);

                return cursor;
            }
        };
        return cursor;
    }
    
        
}

let proxified = 
{
    get: function(obj, prop) {
        if(obj[prop]=== undefined)
        {
            return obj._db[prop]
        }
        return obj[prop];
    }
}