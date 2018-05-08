import { Hardware } from "../../common/env/Hardware";
import {remote} from "../../common/electron/Electron";
const {dialog} = remote;
export class Dialog
{
    static confirm(options)
    {
        options = Object.assign({message:'are you sure to continue'}, options);
        return Hardware.isElectron()?this.confirmElectron(options):this.confirmBrowser(options);
    }
    static confirmElectron(options)
    {
        return new Promise((resolve, reject)=>
        {
            options = Object.assign({buttons:["ok","cancel"],type:'warning',title:'confirm',cancelId:0}, options);
            dialog.showMessageBox(options, (index) => {
                if(index == 1)
                {
                    return reject();
                }
                resolve();
            });
        });
    }
    static confirmBrowser(options)
    {
        let result = confirm(options.message)
        return result?Promise.resolve():Promise.reject();
    }
}