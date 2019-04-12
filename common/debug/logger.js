const util = require('util')
const debug = require('debug')
function logger(name) {

    let instance = debug(name)
    let wrapper = function (...params) {
        params = params.map((item) => {
            if (typeof item == 'object')
                return util.inspect(item, {
                    colors: true,
                    depth: null
                })
            return item;
        })
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