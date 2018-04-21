export class Cookies {
    static setCookie(name, value, expire = -1) {
        if (expire != -1) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expire);
        }
        var c_value = encodeURI(JSON.stringify(value)) + ((expire == -1) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = name + "=" + c_value;
    }
    static removeCookie(name) {
        document.cookie = name + "=" +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
    static getCookie(name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = decodeURI(c_value.substring(c_start, c_end));
        }
        try {
            return c_value != null ? JSON.parse(c_value) : c_value;
        }
        catch (exception) {
            return null;
        }
    }
}