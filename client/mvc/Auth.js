import { LocalForage } from "../data/Forage";
import { event } from "../../common/events/Bus";
import { make } from "../../common/maker/make";
import { API, api } from "../io/API";

export class Auth
{
    static _user;
    static retrieveUser()
    {
        return api("user").path('user/me').then((user)=>{
            if(!user)
            {
                return null;
            }
            let cls = make('user');
            let model = new cls();
            model.readExternal(user);
            Auth.setUser(model);

            API.instance().config({
                params: {
                    api_token : user.token
                }
            });
            api.boot();
        });
    }
    static check()
    {
        return !!this.id();
    }
    static listenLogout()
    {
        //Router.instance().register('logout',this.logout.bind(this));
    }
    static async setUser(user)
    {
        window["user"] = user;
        Auth._user = user;
        if(user && user.token)
        {
            await this.cache().setItem('user', user.writeExternal?user.writeExternal():user);
        }else{
            await this.cache().removeItem('user');
        }
        event('user:login', user);
    }
    static user()
    {
        return  Auth._user;
    }
    static id()
    {
        return  Auth._user?Auth._user.getID():null;
    }
    static type()
    {
        return  Auth._user?Auth._user.type:null;
    }
    static getCacheUser()
    {
        return this.cache().getItem('user');
    }
    static logout()
    {
        Auth._user = null;
        this.cache().removeItem('user').then(()=>
        {
            event('user:logout');
        });
        return api().path('logout').then((user)=>{
            
        });
    }
    static cache() {
        return LocalForage.instance().war("auth");
    }
}
