import { Hardware } from "../../common/env/Hardware";
import {remote} from "../../common/electron/Electron";
import { Objects } from "../../common/utils/Objects";

const {dialog} = remote;
export class Dialog
{
    static confirm(options)
    {
        options = Objects.assign({message:'are you sure to continue', buttons:['ok','cancel']}, options);
        return Hardware.isElectron()?this.confirmElectron(options):this.confirmBrowser(options);
    }
    static confirmElectron(options)
    {
        return new Promise((resolve, reject)=>
        {
            options = Objects.assign({buttons:options.buttons,type:'warning',title:'confirm',cancelId:0}, options);
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