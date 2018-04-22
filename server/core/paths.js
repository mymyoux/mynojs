var path = require("path");

global.base_path = function (folder) {
    var p = path.resolve(path.resolve());
    if (folder) {
        p = path.resolve(p, folder);
    }
    return p;
};
global.app_path = function (folder) {
    return base_path(folder);
};
global.storage_path = function (folder) {
    return app_path(path.join('storage', folder ? folder : ""));
};
global.config_path = function (folder) {
    return app_path(path.join('config', folder ? folder : ""));
};
global.certificates_path = function (folder) {
    return app_path(path.join('certificates', folder ? folder : ""));
};
global.view_path = function (folder) {
    return base_path(path.join('views', folder ? folder : ""));
};
global.public_path = function (folder) {
    return base_path(path.join('public', folder ? folder : ""));
};
global.source_path = function (folder) {
    return base_path(path.join('src', folder ? folder : ""));
};