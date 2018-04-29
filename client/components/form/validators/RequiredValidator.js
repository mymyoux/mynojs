import { Validator } from "./Validator";

export class RequiredValidator extends Validator
{
    name()
    {
        return "required";
    }
    handle(data)
    {
        if(data)
        {
            return true;
        }
        return "required";
    }
}