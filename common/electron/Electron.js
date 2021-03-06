import { Hardware } from "../env/Hardware";
import { fake } from "../fake/Generic";

var electron;
if(Hardware.isElectron())
{
    if(Hardware.isBrowser())
    {
        electron = window.require("electron");
    }else
    {
        electron = require('electron');
    }
}else{
    electron = fake;
}
export default electron; 
let remote = electron.remote;
export {remote};
