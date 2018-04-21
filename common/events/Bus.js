import { EventDispatcher } from "./EventDispatcher";
import {root} from "../env/Root";
export const bus = new EventDispatcher;
export function event(name, ...data)
{
    bus.trigger(name, ...data);
}
root.bus = bus;