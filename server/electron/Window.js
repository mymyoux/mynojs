import { bus } from '../../common/events/Bus';

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
export class Window {
    static windows = [];
    static hasFocus = true;

    static createWindow(path) {
        if (!path) {
            path = base_path("index.html");
        }
        var electronScreen = electron.screen;
        var displays = electronScreen.getAllDisplays();
        var externalDisplay = null;
        //right
        for (var i in displays) {
            if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
                if (!externalDisplay || externalDisplay.bounds.x < displays[i].bounds.x)
                    externalDisplay = displays[i];
            }
        }
        externalDisplay = displays[0];
        if (!externalDisplay) {
            externalDisplay = { bounds: { x: 0, y: 0 } };
        }
        // Create the browser window.
        var window = new BrowserWindow({ useContentSize: true, width: 850, height: 800,
            /*x:externalDisplay.bounds.x+50, y:externalDisplay.bounds.y+50,width: 800, height: 600,*/ backgroundColor: '#FFFFFF',
            //tabbingIdentifier:"carotte",
            webPreferences: {
                experimentalFeatures: true,
                title: "DBViewer",
            } });
        // and load the index.html of the app.
        window.loadURL(url.format({
            pathname: path,
            protocol: 'file:',
            slashes: true
        }));
        //mainWindow.maximize();
        // Open the DevTools.
        // mainWindow.webContents.openDevTools()
        // Emitted when the window is closed.
        window.on('closed', () => {
            this.remove(window);
        });
        if (!this.main) {
            this.main = window;
        }
        this.bindEvent(window);
        this.windows.push(window);
    }
    static getWindows() {
        return this.windows;
    }
    static bindEvent(window) {
        window.on('blur', function () {
            //window.setProgressBar(0.5);
            setImmediate(function () {
                if (!BrowserWindow.getFocusedWindow()) {
                    Window.onAllBlur();
                }
            });
        });
        window.on('focus', function () {
            window.flashFrame(false);
            Window.onFocus();
        });
    }
    static onAllBlur() {
        Window.hasFocus = false;
        bus.trigger("all_blur");
    }
    static onFocus() {
        if (!Window.hasFocus) {
            Window.hasFocus = true;
            bus.trigger('focus');
        }
    }
    static unbindEvent(window) {
        window.removeAllListeners('blur');
        window.removeAllListeners('focus');
    }
    static remove(window) {
        var index = this.windows.indexOf(window);
        if (~index) {
            this.windows.splice(index, 1);
        }
        this.unbindEvent(window);
        if (this.main === window)
            this.main = this.windows[0];
    }
    static close() {
        this.getWindows().forEach((item) => item.close());
    }
}
