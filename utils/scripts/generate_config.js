import { Configuration } from "../../common/env/Configuration";
import { configurationLoader } from "../../server/services/ConfigurationLoader";
import commander from "commander";
import fs from "fs";
import path from "path";
import { file_exists } from "../../client/components/form/validators/file_exists";
import { File } from "../../server/io/File";
require("../../server/core/paths");


commander.version('0.1.0')
.option('-o,--out [path]',"Path to export config file").parse(process.argv);

let url = commander.out;
url = app_path(url);
let directory = url;
if(path.extname(url)=='')
{
    url = path.join(url, 'config.json');
}else
{  
    directory = path.dirname(url);
}
if(!fs.existsSync(directory))
{
    File.mkdirp(directory);
}
configurationLoader.boot().then(()=>
{
    //foce compute env
    Configuration.env();
    fs.writeFileSync(url, JSON.stringify(Configuration.get(), null, 2), {encoding:'utf8'});
    console.log(url+" writed");
})