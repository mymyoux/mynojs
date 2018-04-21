const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const colors = require('colors');

//import { ServerIO } from "../io/ServerIO";
import { URI } from '../../common/utils/URI';
import { CoreObject } from '../../common/core/CoreObject';
import { StepHandler } from '../../common/mixins/StepHandler';
export class Server extends StepHandler(CoreObject){
    _steps = [""];
    constructor() {
        super();
        this._controllers = {};
    }
    config(options) {
        this._options = options;
        console.log(this._options);
    }
    boot2() {
        this._app = express();
        this._app.use(cors());
        let options = {
            key: fs.readFileSync(certificates_path(config('server.express.key')), 'utf8'),
            cert: fs.readFileSync(certificates_path(config('server.express.cert')), 'utf8')
        };
        //console.log(config('server.express'));
        this._server = https.createServer(options, this._app);
        this._serverIO = new ServerIO(this._server, this._options);
        // this._io = require("socket.io")(this._server);
        this._app.use(express.static(public_path()));
        this._app.use(async (req, res, next) => {
            if (req.query.api_token) {
                req.user = await User.findByToken(req.query.api_token);
                next();
            }
            else {
                next();
            }
        });
        this._app.all('*', this.onRequest.bind(this));
        // this._io.on('connection', function(socket) {
        // console.log('new connection');
        // socket.emit('message', 'This is a message from the dark side.');
        // });
        this._server.listen(config('server.port'), function () {
            console.log('server up and running at %s port', config('server.port'));
        });
        this._serverIO.listen();
    }
    async loadController(name) {
        if (this._controllers[name]) {
            return new Promise((resolve) => { resolve(this._controllers[name]); });
        }
        var parts = name.split("/");
        var cls = global.requirejs('server/controllers' + name)[parts[parts.length - 1]];
        this._controllers[name] = new cls();
        var result = await this._controllers[name].run().then(() => {
            return this._controllers[name];
        });
        return result;
    }
    async onIORequest(path, data, user) {
        var exception = function (error, fatal) {
            return Promise.reject(error);
        };
        console.log(colors.gray(path) + " " + ((typeof data == "object" ? URI.objectToString(data) : data)));
        var parts = ("/" + path).split('/');
        var action = parts.pop();
        parts = parts.map(function (item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
        });
        var controller = parts.join('/');
        if (!this._controllers[controller]) {
            try {
                var resultAPI = await this.loadController(controller);
                // var cls = (<any>global).requirejs('myno/server/controllers/'+controller)[parts[parts.length-1]];
                // this.apicontrollers[controller] = new cls();
                // console.log('initializating '+ controller);
                // var result = await this.apicontrollers[controller].run();
                // console.log('initializated '+ controller);
            }
            catch (error) {
                if (error) {
                    console.error(error);
                }
                return exception({ lineNumber: error.lineNumber, fileName: error.fileName, message: 'no controller:' + controller }, true);
            }
        }
        if (typeof this._controllers[controller][action] != "function") {
            return exception({ lineNumber: 0, fileName: "main", message: 'no action:' + controller + '#' + action + '()' }, true);
        }
        try {
            var resultAPI = this._controllers[controller][action](user, data);
        }
        catch (error) {
            return exception(error, true);
        }
        var promise;
        if (!(resultAPI instanceof Promise)) {
            promise = new Promise(function (resolve) {
                // if(resultAPI && typeof resultAPI == "object" && resultAPI.writeExternal)
                // {
                //     resultAPI = resultAPI.writeExternal(user);
                // }
                resolve(resultAPI);
            });
        }
        else {
            promise = resultAPI;
        }
        return promise.then((data) => {
            if (data && typeof data == "object" && data.writeExternal) {
                data = data.writeExternal(user);
            }
            return data;
        });
    }
    async onRequest(request, result) {
        var exception = function (error, fatal) {
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
                    fatal: fatal,
                    api: true,
                    from: request.path
                }
            }, null, 3));
        };
        var url = request.path;
        var parts = url.split('/');
        var action = parts.pop();
        parts = parts.map(function (item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
        });
        var controller = parts.join('/');
        console.log(controller);
        if (!this._controllers[controller]) {
            try {
                var resultAPI = await this.loadController(controller);
                // var cls = (<any>global).requirejs('myno/server/controllers/'+controller)[parts[parts.length-1]];
                // this.apicontrollers[controller] = new cls();
                // console.log('initializating '+ controller);
                // var result = await this.apicontrollers[controller].run();
                // console.log('initializated '+ controller);
            }
            catch (error) {
                if (error) {
                    console.error(error);
                }
                return exception({ lineNumber: error.lineNumber, fileName: error.fileName, message: 'no controller:' + controller }, true);
            }
        }
        if (typeof this._controllers[controller][action] != "function") {
            return exception({ lineNumber: 0, fileName: "main", message: 'no action:' + controller + '#' + action + '()' }, true);
        }
        try {
            var resultAPI = this._controllers[controller][action](request.user, request.query, request, result);
        }
        catch (error) {
            return exception(error, true);
        }
        var promise;
        if (!(resultAPI instanceof Promise)) {
            promise = new Promise(function (resolve) {
                // if(resultAPI && typeof resultAPI == "object" && resultAPI.writeExternal)
                // {
                //     console.log('user write external');
                //     resultAPI = resultAPI.writeExternal(request.user);
                // }else{
                //     console.log('dont write external:'+(typeof resultAPI));
                // }
                resolve(resultAPI);
            });
        }
        else {
            promise = resultAPI;
        }
        promise.then(function (dataResult) {
            if (dataResult && typeof dataResult == "object" && dataResult.writeExternal) {
                dataResult = dataResult.writeExternal(request.user);
            }
            //console.log('send result: '+data.__callID);
            result.setHeader('Content-Type', 'application/json');
            result.send(JSON.stringify({
                data: dataResult
            }, null, 3));
        }).catch(function (error) {
            return exception(error, true);
        });
        return null;
    }
    get io() {
        return this._serverIO;
    }
}
