import { Strings } from "../../../common/utils/Strings";

export class Database {
    constructor(db) {
        this.db = db;
    }
    put(...params) {
        params = this._clearParams(params);
        return this.db.put(...params);
    }
    post(...params) {
        params = this._clearParams(params);
        return this.db.post(...params);
    }
    _clearParams(p) {
        if (!p)
            return p;
        var params;
        for (var q in p) {
            params = p[q];
            var keys = Object.keys(params).filter((item) => Strings.startsWith(item, "__"));
            for (var k of keys) {
                delete params[k];
            }
        }
        return p;
    }
    async get(...params) {
        try {
            params = this._clearParams(params);
            var result = await this.db.get(...params);
            return result;
        }
        catch (error) {
            return null;
        }
    }
    getRaw(...params) {
        params = this._clearParams(params);
        return this.db.get(...params);
    }
    info() {
        return this.db.info();
    }
    async find(...params) {
        try {
            var result = await this.db.find(...params);
            if (result && result.docs) {
                return result.docs;
            }
            return result;
        }
        catch (error) {
            return [];
        }
    }
    async findOne(...params) {
        var results = await this.find(...params);
        if (results.length)
            return results[0];
        return null;
    }
    async all(...params) {
        try {
            if (!params.length) {
                params = [{ include_docs: true }];
            }
            var result = await this.db.allDocs(...params);
            if (result && result.rows) {
                return result.rows.map((item) => item.doc);
            }
            return result;
        }
        catch (error) {
            return [];
        }
    }
    remove(...params) {
        params = this._clearParams(params);
        return this.db.remove(...params);
    }
    getIndexes(...params) {
        return this.db.getIndexes(...params);
    }
    createIndex(...params) {
        return this.db.createIndex(...params);
    }
    deleteIndex(...params) {
        return this.db.deleteIndex(...params);
    }
}
