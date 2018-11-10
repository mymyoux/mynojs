import { Hardware } from "../../common/env/Hardware";
import {remote} from "../../common/electron/Electron";
import { Objects } from "../../common/utils/Objects";

const {clipboard} = remote;
export class Clipboard
{
    static write(options)
    {
        if(typeof options == 'string')
        {
            options = {text:options}
        }
        return Hardware.isElectron()?this.writeElectron(options):this.writeBrowser(options);
    }
    static writeElectron(data)
    {
        clipboard.write(data);
    }
    static writeBrowser(options)
    {
        if(options.text)
        {
            const el = document.createElement('textarea');
            el.value = options.text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }else
        if(options.html)
        {
            const el = document.createElement('textarea');
            el.innerHTML = options.html;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
    }
}