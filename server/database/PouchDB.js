var fs = require("fs");
var path = require("path");
import { Database } from "./pouchdb/Database";
var Pouch = require('pouchdb');
export class PouchDB {
    constructor(dirname, options) {
        this.databases = {};
        PouchDB._instance = this;
        this.dirname = dirname;
        this.dbOptions = options;
        //create directory if not exists
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }
        Pouch.on("error", function (error) {
            console.log("ERROR", error);
        });
        Pouch.on("openError", function (error) {
            console.log("EOPEN RROR", error);
        });
        //Pouch.debug.enable('*');
        Pouch.plugin(require('pouchdb-find'));
    }
    static instance() {
        return this._instance;
    }
    static db(name) {
        return PouchDB.instance().db(name);
    }
    db(name) {
        if (!this.databases[name]) {
            return this.createDB(name);
        }
        return this.databases[name];
    }
    createDB(name) {
        var full_path = path.join(this.dirname, name); //+".json";
        console.log("PouchDB:\t" + full_path);
        var database;
        //TODO:remove
        // if(fs.existsSync(full_path))
        // {
        //     fs.unlinkSync(full_path);
        // }
        database = new Database(new Pouch(full_path, { auto_compaction: true }));
        if (!this.database) {
            this.database = database;
        }
        this.databases[name] = database;
        return database;
    }
}
