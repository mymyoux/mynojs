import {Nedb as NedbParent} from "../../common/database/Nedb";
import path from "path";
import fs from "fs";
import { File } from "../io/File";
export class Nedb extends NedbParent
{
    boot()
    {
        if(!this._options.filename)
        {
            this._options.filename = data_path(this._name+".db");
        }
        const dirname = path.dirname(this._options.filename);
        return File.exists(dirname).then((exists)=>
        {
            if(!exists)
            {
                return File.mkdirp(dirname).then(()=>
                {
                    return super.boot();
                });
            }
            return super.boot();
        });
    }
}