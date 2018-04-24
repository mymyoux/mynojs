import { Hardware } from "../../common/env/Hardware";
import { fake } from "../../common/fake/Generic";

var electron;
if(Hardware.isElectron())
{
    electron = require('electron');
}else{
    electron = fake;
}
export default electron; 
