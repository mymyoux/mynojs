export class Arrays {
    static isArray(obj) {
        return Array.isArray(obj);
    }
    static binaryFindArray(array, element, properties, orders) {
        var minIndex = 0;
        var maxIndex = array.length - 1;
        var currentIndex;
        var currentElement;
        var property;
        var len = properties.length;
        var lesser;
        var order;
        //searchElement = property ? element[property] : element;
        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) >> 1;
            //					currentElement = property ? (array[currentIndex] ? array[currentIndex][property] : null) : array[currentIndex];
            lesser = null;
            for (var i = 0; i < len; i++) {
                order = orders[i];
                if (element[properties[i]] > array[currentIndex][properties[i]] || (element[properties[i]] != null && array[currentIndex][properties[i]] == null)) {
                    lesser = true;
                    break;
                }
                if (element[properties[i]] < array[currentIndex][properties[i]] || (element[properties[i]] == null && array[currentIndex][properties[i]] != null)) {
                    lesser = false;
                    break;
                }
            }
            if ((order == 1 && lesser === true) || (order == -1 && lesser === false)) {
                minIndex = currentIndex + 1;
            }
            else if ((order == 1 && lesser === false) || (order == -1 && lesser === true)) {
                maxIndex = currentIndex - 1;
            }
            else {
                //==
                return {
                    found: true,
                    index: currentIndex,
                    order: order
                };
            }
        }
        currentIndex = (order == 1 && lesser === true) || (order == -1 && lesser === false) ? currentIndex + 1 : currentIndex;
        return {
            found: false,
            index: currentIndex,
            order: order
        };
    }
    static binaryFind(array, searchElement, property, order = 1) {
        var minIndex = 0;
        var maxIndex = array.length - 1;
        var currentIndex;
        var currentElement;
        if (order > 0) {
            order = 1;
        }
        else {
            order = -1;
        }
        searchElement = property ? searchElement[property] : searchElement;
        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) >> 1;
            currentElement = property ? (array[currentIndex] ? array[currentIndex][property] : null) : array[currentIndex];
            if ((order == 1 && currentElement < searchElement) || (order == -1 && currentElement > searchElement)) {
                minIndex = currentIndex + 1;
            }
            else if ((order == 1 && currentElement > searchElement) || (order == -1 && currentElement < searchElement)) {
                maxIndex = currentIndex - 1;
            }
            else {
                return {
                    found: true,
                    index: currentIndex
                };
            }
        }
        currentIndex = (order == 1 && currentElement < searchElement) || (order == -1 && currentElement > searchElement) ? currentIndex + 1 : currentIndex;
        return {
            found: false,
            index: currentIndex
        };
    }
}