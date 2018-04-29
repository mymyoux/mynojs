import { Validator } from "./Validator";

export class RequiredValidator extends Validator
{
    name()
    {
        return "required";
    }
}