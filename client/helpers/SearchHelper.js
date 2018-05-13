export class SearchHelper {
    static transform(name, search) {
        var tmp = name;
        var reg = new RegExp("(.*)(" + search + ")(.*)", "gi");
        if (reg.test(name)) {
            return name.replace(reg, "$1<b>$2</b>$3");
        }
        var indexes = this.match(name, search);
        if (!indexes)
            return name;
        indexes.sort(function (a, b) {
            return a - b;
        });
        var offset = 0;
        for (var index of indexes) {
            name = name.substring(0, index + offset) + '<b>' + name.substr(index + offset, 1) + '</b>' + name.substring(index + offset + 1);
            offset += 7;
        }
        return name;
    }
    static match(name, search) {
        name = name.toLowerCase();
        search = search.toLowerCase();
        var words = search.split(" ");
        var tokens;
        var index;
        var index2 = 0;
        var matches = [];
        var offset = 0;
        var matchIndex;
        for (var word of words) {
            tokens = word.split("");
            index = 0;
            matchIndex = 0;
            token: while (index < tokens.length) {
                index2 -= 2;
                if (index2 < 0)
                    index2 = 0;
                while (index2 < name.length && (!matchIndex || index2 < matchIndex + 3)) {
                    if (tokens[index] == name[index2] && !~matches.indexOf(index2)) {
                        matchIndex = index2;
                        matches.push(index2);
                        index++;
                        index2++;
                        continue token;
                    }
                    index2++;
                }
                if (index2 < name.length && matchIndex) {
                    var tmp = matches.indexOf(matchIndex);
                    if (~tmp) {
                        matches = matches.slice(0, tmp);
                    }
                    //to cancel -2 effect
                    index2 = matchIndex + 1 + 2;
                    index = 0;
                    matchIndex = 0;
                    continue token;
                }
                return false;
            }
        }
        return matches;
    }
    static test(name, search)
    {
        return !!this.match(name, search);
    }
}
