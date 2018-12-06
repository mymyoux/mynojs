import { LocalForage } from "../data/Forage";
import { event } from "../../common/events/Bus";
import { make } from "../../common/maker/make";
import { API, api } from "../io/API";

let binding = 
{
    user:null
}
export class Auth
{
    static binding()
    {
        return binding;
    }
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
        binding.user = user;debugger;
        API.instance().config({
            params: {
                api_token : user?user.token:null,
                user_id:user?user.id:null
            }
        });
        if(user && user.token)
        {
            await this.cache().setItem('user', user.writeExternal?user.writeExternal():user);
        }else{
            await this.cache().removeItem('user');
        }
        event('user:login', user);
    }
    static async setRawUser(user)
    {
        let cls = make('user');
        let model = new cls();
        model.readExternal(user);

        return await this.setUser(model)
    }
    static user()
    {
        return  binding.user;
    }
    static id()
    {
        return  binding.user?binding.user.getID():null;
    }
    static type()
    {
        return  binding.user?binding.user.type:null;
    }
    static getCacheUser()
    {
        return this.cache().getItem('user');
    }
    static logout()
    {
        binding.user = null;
        this.cache().removeItem('user').then(()=>
        {
            event('user:logout');
        });
        return api().path('user/logout').then((user)=>{
            
        });
    }
    static cache() {
        return LocalForage.instance().war("auth");
    }
}


