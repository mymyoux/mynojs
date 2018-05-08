import {remote} from "../../common/electron/Electron";
const { Menu, MenuItem, app,dialog } = remote;
import { Configuration } from "../../common/env/Configuration";
import { Hardware } from "../../common/env/Hardware";
import { bus } from "../../common/events/Bus";
import Vue from 'vue';
//import { Updater } from "./Updater";
export class MenuHelper {
    static initialize() {
        this.updateMenu(false);
    }
    static updateMenu(server = false) {
        console.log("UPDATE MENU:" + server);
        console.log("initialize menu");
        var template = [
            {
                label: 'File',
                submenu: [
                    /*{
                        label: 'import', enabled: server, click: function () {
                            var result = dialog.showOpenDialog({ properties: ['openFile'], message: "import sql file" });
                            if (!result)
                                return;
                            // var tab:TabModel = Inst.get(TabCollection).getSelected();
                            // if(!tab || !tab.server || !tab.server.database_name)
                            // {
                            //     return;
                            // }
                            // tab.server.importFile(result[0]);
                            bus.trigger('import', result[0]);
                        },
                    },
                    {
                        label: 'export', enabled: server, click: function () {
                            $(".component.server.server-container").trigger("show-export");
                            return;
                            // var result:any = dialog.showSaveDialog({properties: ['openFile'],message:"export database"});
                            // if(!result)
                            //     return;
                            // var tab:TabModel = Inst.get(TabCollection).getSelected();
                            // if(!tab || !tab.server || !tab.server.database_name)
                            // {
                            //     return;
                            // }
                            // tab.server.exportFile(result);
                        },
                    }*/
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                    { role: 'pasteandmatchstyle' },
                    { role: 'delete' },
                    { role: 'selectall' }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'reload' },
                    { role: 'forcereload' },
                    { role: 'toggledevtools' },
                    { type: 'separator' },
                    { role: 'resetzoom' },
                    { role: 'zoomin' },
                    { role: 'zoomout' },
                    { type: 'separator' },
                    { role: 'togglefullscreen' }
                ]
            },
            {
                role: 'window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'close' }
                ]
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'Learn More',
                        click() { require('electron').shell.openExternal('https://db.myno.io'); }
                    }
                ]
            }
        ];
        if (!Configuration.isDebug())
            template[2].submenu.splice(0, 4);
        if (process.platform === 'darwin') {
            template.unshift({
                label: app.getName(),
                submenu: [
                    { role: 'about' },
                    { label: 'Check for updates...', click: () => {
                            //Updater.check();
                        } },
                    { type: 'separator' },
                    { label: 'Preferences', click: () => {
                            //Router.instance().goto('options');
                        } },
                    { type: 'separator' },
                    { role: 'services', submenu: [] },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideothers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            });
            // Edit menu
            template[2].submenu.push({ type: 'separator' }, {
                label: 'Speech',
                submenu: [
                    { role: 'startspeaking' },
                    { role: 'stopspeaking' }
                ]
            });
            // Window menu
            template[4].submenu = [
                { role: 'close' },
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'front' }
            ];
        }
        else {
            template[0].submenu.push({ type: 'separator' }, { label: 'Check for updates...', click: () => {
                    Updater.check();
                } }, { label: 'Preferences', click: () => {
                    Router.instance().goto('options');
                } });
        }
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
    static open(menu, event) {

        if (!event && !(menu instanceof Menu)) {
            event = menu;
            menu = null;
        }
        if (!menu) {
            menu = new Menu();
        }
        let node = event.target;
        while (node) {
            if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
                if (menu.items) {
                    menu.append(new MenuItem({ type: 'separator' }));
                }
                menu.append(new MenuItem({ 'role': 'undo' }));
                menu.append(new MenuItem({ 'role': 'redo' }));
                menu.append(new MenuItem({ type: 'separator' }));
                menu.append(new MenuItem({ 'role': 'cut' }));
                menu.append(new MenuItem({ 'role': 'copy' }));
                menu.append(new MenuItem({ 'role': 'paste' }));
                menu.append(new MenuItem({ type: 'separator' }));
                menu.append(new MenuItem({ 'role': 'selectall' }));
                break;
            }
            node = node.parentNode;
        }
        if (Configuration.isDebug()) {
            if (menu.items) {
                menu.append(new MenuItem({ type: 'separator' }));
            }
            menu.append(new MenuItem({ label: 'Inspect Element', click() {
                    remote .getCurrentWindow().inspectElement(event.x, event.y);
                } }));
        }
        if (menu && menu.items) {
            menu.popup(remote.getCurrentWindow());
        }
    }
    static buildFromTemplate(template, options)
    {

        if(options instanceof Event)
        {
            event = options;
            options = null;
        }

        options = Object.assign({generic:true},options);
        if(!template)
        {
            template = [];
        }
        let e = event;
        if(options.generic)
        {
            if (Configuration.isDebug() && event) {
                if(template.length)
                {
                    template.push({type:"separator"});
                }
                template.push({label:'Inspect Element', click()
                {
                    remote.getCurrentWindow().inspectElement(e.x, e.y);
                }})
            }
        }
        let menu;
        if(Hardware.isElectron())
        {
            menu = Menu.buildFromTemplate(template);
            menu.show = this.show.bind(this, menu);
        }else
        {
            menu = new BrowserMenu(template);
        }
        return menu;
    }
    static show(menu, options)
    {
        options = Object.assign({window:remote.getCurrentWindow()},options);
        Vue.nextTick(()=>
        {
            menu.popup(options);
        })
    }
}

class BrowserMenu
{
    template = null;
    constructor(template)
    {
        this.template = template;
    }
    show()
    {
        bus.trigger("show-context-menu", this);
    }
    toTree()
    {
        return this.template;
    }
}