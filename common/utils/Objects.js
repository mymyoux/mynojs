    export class Objects {
    static deepEquals(a, b, exclude) {
        if (typeof a != typeof b) {
            return false;
        }
        if (typeof a == "object") {
            if (a instanceof Date) {
                if (b instanceof Date) {
                    return a == b;
                }
                else {
                    return false;
                }
            }
            else if (b instanceof Date) {
                return false;
            }
            for (var p in a) {
                if (exclude && exclude.indexOf(p) !== -1) {
                    continue;
                }
                if (!Objects.deepEquals(a[p], b[p])) {
                    return false;
                }
            }
            for (var p in b) {
                if (exclude && exclude.indexOf(p) !== -1) {
                    continue;
                }
                if (!Objects.deepEquals(a[p], b[p])) {
                    return false;
                }
            }
            return true;
        }
        else {
            return a == b;
        }
    }
    static clone(obj, ignore, hidePrivate = false) {
        //console.log(obj);
        if (ignore) {
            if (typeof ignore == "string") {
                ignore = [ignore];
            }
        }
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj)
            return obj;
        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            var copy_array = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy_array[i] = Objects.clone(obj[i], null, hidePrivate);
            }
            return copy_array;
        }
        // Handle Object
        if (obj instanceof Object) {
            var copy_object = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr) && (!ignore || ignore.indexOf(attr) == -1) && (!hidePrivate || attr.substring(0, 1) != "_")) {
                    if (obj[attr] === obj) {
                        //circular
                        copy_object[attr] = copy_object;
                    }
                    else {
                        copy_object[attr] = Objects.clone(obj[attr], null, hidePrivate);
                    }
                }
            }
            return copy_object;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
    static makeNestedObject(data, name) {
        var names = name.split(".");
        var len = names.length;
        for (var i = 0; i < len; i++) {
            if (!data[names[i]]) {
                data[names[i]] = {};
            }
            data = data[names[i]];
        }
        return data;
    }
    static mergeProperties(propertyKey, firstObject, secondObject) {
        var propertyValue = firstObject[propertyKey];
        var propertyValue2 = secondObject[propertyKey];
        if (typeof (propertyValue) === "object" && !(propertyValue instanceof Date) && propertyValue2 !== undefined && !(propertyValue2 instanceof Date)) {
            return Objects.mergeObjects(firstObject[propertyKey], secondObject[propertyKey]);
        }
        else if (secondObject[propertyKey] === undefined) {
            return firstObject[propertyKey];
        }
        return secondObject[propertyKey];
    }
    static merge(firstObject, secondObject) {
        return this.mergeObjects(firstObject, secondObject);
    }
    static mergeObjects(firstObject, secondObject) {
        if (!firstObject) {
            return secondObject;
        }
        if (!secondObject) {
            return firstObject;
        }
        var finalObject = {};
        // Merge first object and its properties.
        for (var propertyKey in firstObject) {
            finalObject[propertyKey] = Objects.mergeProperties(propertyKey, firstObject, secondObject);
        }
        // Merge second object and its properties.
        for (var propertyKey in secondObject) {
            finalObject[propertyKey] = Objects.mergeProperties(propertyKey, secondObject, finalObject);
        }
        return finalObject;
    }
    static getAllPropertiesName(object) {
        var properties = [];
        if (Object.getOwnPropertyNames && Object.getPrototypeOf) {
            properties = properties.concat(Object.getOwnPropertyNames(object));
            var proto = Object.getPrototypeOf(object);
            if (proto) {
                properties = properties.concat(this.getAllPropertiesName(proto));
            }
        }
        else {
            for (var p in object) {
                properties.push(p);
            }
        }
        return properties;
    }
    static assign(previous, ...newValues)
    {
        return Object.assign({}, previous, ...newValues);
    }
}
