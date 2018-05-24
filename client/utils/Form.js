import { Objects } from "../../common/utils/Objects";

export class Form
{
    static needsFormData(data)
    {
        if(typeof data == "object")
        {
            if(!data)
            {
                return false;
            }
            if(data.formData instanceof File || (data.buffer && data.buffer.constructor && data.buffer.constructor.name == "Buffer"))
            {
                return true;
            }
            if(data.formData instanceof File || (data.buffer && data.buffer.constructor && data.buffer.constructor.name == "ReadStream"))
            {
                return true;
            }
            let keys = Object.keys(data);
            return keys.some((key)=>
            {
                let result = this.needsFormData(data[key]);
                if(result)
                {
                    return true;
                }
                return false;
            });
        }
        if(data instanceof File)
        {
            return true;
        }
        if(data  && data.constructor && data.constructor.name == "Buffer")
        {
            return true;
        }
        if(data  && data.constructor && data.constructor.name == "ReadStream")
        {
            return true;
        }
        return false;
    }
    static toData(data)
    {
        let keys = Object.keys(data);

        let useFormData = false;

        let clone = {};

        function convert(object)
        {
            if(object && typeof object == "object")
            {
                if(Array.isArray(object))
                {
                    return object.map((item)=>convert(item));
                }
                if(object instanceof File)
                {
                    useFormData = true;
                    return object;
                }
                if(object instanceof Buffer)
                {
                    useFormData = true;
                    return object;
                }
                if(object.formData instanceof File)
                {
                    useFormData = true;
                    return object.formData;
                }
                if(object.buffer instanceof Buffer)
                {
                    useFormData = true;
                    return object.buffer;
                }
                let keys = Object.keys(object);
                let cloned = {};
                keys.forEach((key)=>
                {
                    let value = object[key];
                    cloned[key] = convert(value);
                });
                return cloned;
            }
            return object;
        }

        keys.forEach((key)=>
        {
            let value = data[key];
            clone[key] = convert(value);
        });
        if(useFormData)
        {
            return this.toFormData(clone);
    
        }

        return clone;
    }
    static toFormData(data,formData)
    {   
        if(!formData)
        {
            formData = new FormData();
        }
        let keys = Object.keys(data);
        keys.forEach((key)=>
        {
            if(typeof data[key]== "object" && data[key] && data[key].formData instanceof File)
            {
                formData.set(key, data[key].formData, data[key].name);
            }else
            if(typeof data[key]== "object" && data[key] && data[key].buffer && data[key].buffer.constructor && data[key].buffer.constructor.name == "Buffer")
            {
                
                formData.set(key, data[key].buffer);
            }else
            if(typeof data[key]== "object" && data[key] && data[key].buffer && data[key].buffer.constructor && data[key].buffer.constructor.name == "ReadStream")
            {
                
                formData.set(key, data[key].buffer, data[key].name);
            }else
            if(data[key] instanceof File || (data[key] && data[key].constructor && data[key].constructor.name == "Buffer") || (data[key] && data[key].constructor && data[key].constructor.name == "ReadStream"))
            {
                
                formData.set(key, data[key], data[key].name);
            }else
            if(data[key]  && typeof data[key] == "object")
            {
                if(Array.isArray(data[key]))
                {
                    data[key].forEach((item)=>
                    {
                        if(typeof item== "object" && item && item.formData instanceof File)
                        {
                            
                            formData.append(key+'[]',item.formData, item.name);
                        }
                        if(typeof item== "object" && item && item.buffer && item.buffer.constructor && item.buffer.constructor.name == "Buffer")
                        {
                            
                            formData.append(key+'[]',item.buffer, item.name);
                        }else
                        if(typeof item== "object" && item && item.buffer && item.buffer.constructor && item.buffer.constructor.name == "ReadStream")
                        {
                            
                            formData.append(key+'[]',item.buffer, item.name);
                        }else
                        if(item instanceof File || (item && item.constructor && item.constructor.name == "Buffer") || (item && item.constructor && item.constructor.name == "ReadStream"))
                        {
                            
                            formData.append(key+'[]', item, item.name);
                        }else
                        {
                            formData.append(key+'[]', JSON.stringify(item));
                        }
                    });

                }else
                {
                    formData.set(key, JSON.stringify(data[key]));
                }
                //TODO:handle subfiles ? 
            }else
            {
                formData.set(key, JSON.stringify(data[key]));
            }
        });
        return formData;
    }
}