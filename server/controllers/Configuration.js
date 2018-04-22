import { Controller } from "../mvc/Controller";
import { config } from "../../common/env/Configuration";

export class Configuration extends Controller
{
    get()
    {
        return config();
    }
}