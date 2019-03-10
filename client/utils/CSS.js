export default {
    get(label) {
        return  getComputedStyle(document.documentElement).getPropertyValue(label);
    },
    set(label, value) {
        return getComputedStyle(document.documentElement).setPropertyValue(label, value);
    }
}