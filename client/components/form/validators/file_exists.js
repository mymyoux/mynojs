import electron from "../../../../common/electron/Electron";
import { Hardware } from "../../../../common/env/Hardware";
import { Promise } from "bluebird";

const isElectron = Hardware.isElectron();
export const file_exists = {
    getMessage(field, args, error) {
        if(error && error.path)
            return error.path+" doesn\'t exist"
        return field+" path doesn\'t exist"
    },
    validate(value, args) {
        if(!isElectron)
            return true;
        let fs = electron.remote.require("fs");
        return new Promise((resolve, reject)=>
        {
            fs.stat(value, (error, value)=>
            {
                if(error)
                {
                    resolve({valid:false,data:error});
                }else
                {
                    resolve({valid:true,data:value});
                }
            });
        })
    }
  };
  