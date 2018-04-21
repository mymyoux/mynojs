export function applyCustomMixin(original, mixin) {
    var tocopy = mixin(original.constructor);
    var virginClass = mixin(function () { });
    var virgin = new virginClass();
    for (var p in virgin) {
        if (typeof virgin[p] == "function") {
            console.log("copy:" + p + " as function");
            original[p] = tocopy.prototype[p]; //.bind(original);
        }
        else {
            console.log("copy:" + p + " as variable");
            original[p] = virgin[p];
        }
    }
    return original;
}