const util = require('util')
const color = require('colors')
const debug = require('debug')
import {Hardware} from 'myno/common/env/Hardware'
let time = -1
function logger(name) {

    let instance = debug(name)
    let wrapper = function (...params) {
        if (time == -1) {
            time = Date.now()
        }
        params = params.map((item) => {
            if (!Hardware.isBrowser() && typeof item == 'object')
                return util.inspect(item, {
                    colors: true,
                    depth: null
                })
            return item;
        })
        params.push(color.red('('+(Date.now()-time)+'ms)'))
        time = Date.now()
        return instance(...params)
    }
    wrapper.extend = function (subname) {
        return logger(`${name}:${subname}`)
    }
    Object.defineProperty(wrapper, 'log', {
        get: function () {
            return instance.log
        },
        set: function (value) {
            instance.log = value
        }
    });
    return wrapper
}
export {
    logger
}