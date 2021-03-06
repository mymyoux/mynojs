import { CoreObject } from "../../../common/core/CoreObject";
import { StepHandler } from "../../../common/mixins/StepHandler";
import express from "express";
import { WrapProxy } from "../../../common/utils/WrapProxy";
import { config } from "../../../common/env/Configuration";
import fs from "fs";
import https from "https";
import { api } from "../API";
import bodyParser from "body-parser";
import { S_IFIFO } from "constants";
import { Strings } from "../../../common/utils/Strings";
import { Objects } from "../../../common/utils/Objects";
export class Express extends StepHandler(CoreObject)
{
    _steps = ["configuration"]

    _app = null;
    _server = null;
    constructor()
    {
        super();
        this._app = express();
        this._app.use( bodyParser.json() );       // to support JSON-encoded bodies
        this._app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
            extended: true
        })); 
        var proxy = new Proxy(this, WrapProxy('_app'));
        return proxy;
    }
    get app()
    {
        return this._app;
    }
    get server()
    {
        return this._server;
    }
    static(path)
    {
        this._app.use(express.static(path));
    }
    configuration()
    {
        let options = {
            key: fs.readFileSync(certificates_path(config('server.express.key')), 'utf8'),
            cert: fs.readFileSync(certificates_path(config('server.express.cert')), 'utf8')
        };
        this._server = https.createServer(options, this._app);
        this._app.all('*', this.onRequest.bind(this));
    }
    listen()
    {
        return new Promise((resolve)=>
        {

            this._server.listen(config('server.port'), function () {
                console.log('server up and running at %s port', config('server.port'));
                resolve();
            });
        });
    }
    async onRequest(request, result) {
        let params = Objects.assign(request.query, request.body);
        if(true || params.__type == "json")
        Object.keys(params).forEach((item)=>
        {
            if(typeof params[item] == "string")
            {
                // if(Strings.startsWith(params[item],"{") || Strings.startsWith(params[item],"{"))
                // {
                    try
                    {
                        params[item] = JSON.parse(params[item]);
                    }catch(error)
                    {
                        //ignore
                    }
                //}
            }
        });
        console.log(params);

        let path = request.path.substring(1);


        request.send = function(type, data, stream)
        {
            stream._buffer.push({type:type, data:data});
        };

        api().path(path).sender(request).params(params).execute().then((data)=>
        {
            result.setHeader('Content-Type', 'application/json');
            result.send(JSON.stringify({
                data: data
            }, null, 3));
        }, (error)=>
        {
            console.error("[Error]", error);
            if (error.status == 409) {
                debugger;
            }
            result.setHeader('Content-Type', 'application/json');
            result.send(JSON.stringify({
                exception: {
                    message: error.message,
                    file: error.fileName,
                    line: error.lineNumber,
                    type: error.constructor + "",
                    fatal: error.fatal,
                    api: true,
                    from: request.path
                }
            }, null, 3));
        });

       // result.status(404).send("Sorry can't find that!")
    }
    // use(middleware)
    // {   
    //     console.log('use', middleware);
    //     this._uses.push(middleware);
    // }
}