export class URI {
    static parse(str) {
        var o = URI.options, m = o.parser[o.strictMode ? "strict" : "loose"].exec(str), uri = {}, i = 14;
        while (i--)
            uri[o.key[i]] = m[i] || "";
        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
            if ($1)
                uri[o.q.name][$1] = $2;
        });
        return uri;
    }
    static buildURI(url, params = null) {
        if (typeof url == "object") {
            params = url;
            url = "";
        }
        if (params) {
            url += "?";
            url += URI.objectToString(params);
        }
        return url;
    }
    static objectToString(object, prefix = null) {
        if (!object) {
            return object;
        }
        return Object.keys(object).map(function (key) {
            if (object[key] == null) {
                return null;
            }
            if (typeof object[key] == "object") {
                return URI.objectToString(object[key], prefix ? prefix + "[" + key + "]" : key);
            }
            return (prefix ? prefix + "[" + key + "]" : key) + '=' + encodeURIComponent(object[key]);
        }).filter(function (value) {
            return value != null;
        }).join('&');
    }
}
URI.options = {
    strictMode: false,
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};
