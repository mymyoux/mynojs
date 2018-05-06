import mkdirp from "mkdirp";
import fs from "fs";
export class File
{
    static mkdirp(dir, opts)
    {
        return new Promise((resolve ,reject)=>
        {
            mkdirp(dir, opts, (error, data)=>
            {
                if(error)
                {
                    reject(error);
                }else
                {
                    resolve(data);
                }
            })
        });
    }
    static exists(path)
    {
        return new Promise((resolve, reject)=>
        {
            fs.stat(path, (errors, data)=>
            {   
                if(errors)
                {
                    resolve(false);
                }else
                {
                    resolve(true);
                }
            });
        });
    }
}