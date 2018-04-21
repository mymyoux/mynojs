import { Inst } from "../core/Inst";

export function Singleton(Child) {
    return class extends Child {
        constructor(...args) {
            super(...args);
            Inst.register(this);
        }
    };
}