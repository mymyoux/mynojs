export class Colours {
    static hexadecimalToRGB(value) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
        return result ? {
            red: parseInt(result[1], 16),
            green: parseInt(result[2], 16),
            blue: parseInt(result[3], 16)
        } : null;
    }
    static RGBToHexadecimal(red, green, blue) {
        return "#" + Colours._componentToHexadecimal(red) + Colours._componentToHexadecimal(green) + Colours._componentToHexadecimal(blue);
    }
    static ligthness(red, green, blue) { 
        if (typeof red == "string") {
            var result = Colours.hexadecimalToRGB(red);
            red = result.red;
            green = result.green;
            blue = result.blue;
        }
        return Colours.RGBToHSL(red, green, blue).lightness;
        //return 0.2126*(<number>red)+0.7152*green+0.0722*blue;
    }
    static RGBToHSL(red, green, blue) {
        red /= 255, green /= 255, blue /= 255;
        var max = Math.max(red, green, blue), min = Math.min(red, green, blue);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case red:
                    h = (green - blue) / d + (green < blue ? 6 : 0);
                    break;
                case green:
                    h = (blue - red) / d + 2;
                    break;
                case blue:
                    h = (red - green) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { hue: Math.floor(h * 360), saturation: Math.floor(s * 100), lightness: Math.floor(l * 100) };
    }
    static _componentToHexadecimal(component) {
        var hex = component.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}
export class Gradient {
    constructor() {
        this.count = 100;
        this.colours = ['ff0000', 'ffff00', '00ff00', '0000ff'];
        this.setColours(this.colours);
    }
    setColours(...colours) {
        if (colours.length == 1) {
            colours = colours[0];
        }
        if (colours.length < 2) {
            throw new Error('You have to have two or more colours.');
        }
        else {
            var len = colours.length - 1;
            var inteval = this.count / len;
            this.gradients = [];
            for (var i = 0; i < len; i++) {
                var colourGradient = new ColourGradient();
                colourGradient.setGradient(colours[i], colours[i + 1]);
                colourGradient.setRange(inteval * i, inteval * (i + 1));
                this.gradients.push(colourGradient);
            }
            this.colours = colours;
        }
    }
    getColour(index, modulo = true) {
        if (modulo) {
            index = index % this.count;
        }
        var len = this.gradients.length;
        var segment = this.count / len;
        var indexGradient = Math.min(Math.floor(Math.max(index, 0) / segment), len - 1);
        // console.log(index+" : "+this.count+"|"+len+"     "+segment+" ====> "+indexGradient);
        // console.log(indexGradient);
        return this.gradients[indexGradient].getColour(index);
    }
    getMax() {
        return this.count;
    }
    setMax(count) {
        this.count = count;
        this.setColours(this.colours);
    }
}
export class ColourGradient {
    constructor() {
        this.min = 0;
        this.max = 100;
    }
    setGradient(colour1, colour2) {
        if (colour1.substring(0, 1) == "#") {
            colour1 = colour1.substring(1);
        }
        if (colour2.substring(0, 1) == "#") {
            colour2 = colour2.substring(1);
        }
        this.colour1 = colour1;
        this.colour2 = colour2;
    }
    setRange(min, max) {
        this.min = min;
        this.max = max;
    }
    getColour(index) {
        //console.log(this.min+" : "+index+" : "+this.max);
        return "#" + this.hex(index, this.colour1.substring(0, 2), this.colour2.substring(0, 2))
            + this.hex(index, this.colour1.substring(2, 4), this.colour2.substring(2, 4))
            + this.hex(index, this.colour1.substring(4, 6), this.colour2.substring(4, 6));
    }
    hex(index, start16, end16) {
        if (index < this.min) {
            index = this.min;
        }
        if (index > this.max) {
            index = this.max;
        }
        var range = this.max - this.min;
        var start10 = parseInt(start16, 16);
        var end10 = parseInt(end16, 16);
        var index2 = (end10 - start10) / range;
        var base10 = Math.round(index2 * (index - this.min) + start10);
        var base16 = base10.toString(16);
        if (base16.length == 1) {
            base16 = "0" + base16;
        }
        return base16;
    }
}