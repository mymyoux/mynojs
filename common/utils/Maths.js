    /**
     * Maths
     */
    export class Maths {
        /**
         * Gets unique ID for current instance
         * @returns {number}
         */
        static getUniqueID() {
            return this.unique++;
        }
        /**
         * Génère un entier aléatoirement compris entre min et max (bornes comprises)
         * @param min Valeur minimum
         * @param max Valeur maximum
         * @return Un entier entre min et max compris.
         */
        static randBetween(min, max) {
            if (max <= min) {
                return min;
            }
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        /**
         * Génère un entier aléatoirement compris entre min et max (bornes comprises)
         * @param min Valeur minimum
         * @param max Valeur maximum
         * @return Un entier entre min et max compris.
         */
        static randNumberBetween(min, max) {
            if (max <= min) {
                return min;
            }
            return Math.random() * (max - min) + min;
        }
        static randomize(myArray) {
            var i = myArray.length;
            if (i == 0)
                return myArray;
            while (--i) {
                var j = Math.floor(Math.random() * (i + 1));
                var tempi = myArray[i];
                var tempj = myArray[j];
                myArray[i] = tempj;
                myArray[j] = tempi;
            }
            return myArray;
        }
        /**
         * Gets Winding Number
         * @param points Array of Points (x ,y)
         * @param x X coordinate
         * @param y Y Coordinate
         * @return {Number}
         */
        static getWindingNumber(points, x, y) {
            function isLeft(P0, P1) {
                return ((P1.x - P0.x) * (y - P0.y)
                    - (x - P0.x) * (P1.y - P0.y));
            }
            var wn = 0;
            var length = points.length - 1;
            for (var i = 0; i < length; i++) {
                if (points[i].y <= y) {
                    if (points[i + 1].y > y)
                        if (isLeft(points[i], points[i + 1]) > 0)
                            wn++;
                }
                else {
                    if (points[i + 1].y <= y)
                        if (isLeft(points[i], points[i + 1]) < 0)
                            wn++;
                }
            }
            return wn;
        }
        /**
         * Tests if a point is inside a polygon
         * @param points Array of Points (x:x, y:y)
         * @param x X coordinate
         * @param y Y Coordinate
         * @return {Boolean}
         */
        static isPointInPolygon(points, x, y) {
            return Maths.getWindingNumber(points, x, y) != 0;
        }
        /**
         * Converts a number to a string with a min of digits
         * @param number Original number
         * @param min Minimum of digits
         * @returns {string} final string
         */
        static toMinNumber(number, min) {
            var strNum = number + "";
            while (strNum.length < min) {
                strNum = "0" + strNum;
            }
            return strNum;
        }
        /**
         * Caps a number between two values
         * @param value number to cap
         * @param min min value. If null there is no min value
         * @param max max value. If null there is no min value
         * @returns {number}
         */
        static cap(value, min = null, max = null) {
            if (min !== null) {
                if (value < min) {
                    return min;
                }
            }
            if (max !== null) {
                if (value > max) {
                    return max;
                }
            }
            return value;
        }
        static pi(digit) {
            var sum = 0;
            var k = 0;
            while (k < digit) {
                sum += Math.pow(16, -k) * (4 / (8 * k + 1) - 2 / (8 * k + 4) - 1 / (8 * k + 5) - 1 / (8 * k + 6));
                k++;
            }
            return sum;
        }
        static isNumeric(data) {
            return !isNaN(parseFloat(data)) && isFinite(data);
        }
        static romanize(num) {
            if (!+num)
                return "";
            var digits = String(+num).split(""), key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
                "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
                "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"], roman = "", i = 3;
            while (i--)
                roman = (key[+digits.pop() + (i * 10)] || "") + roman;
            return Array(+digits.join("") + 1).join("M") + roman;
        }
    }
    Maths.unique = 0;
