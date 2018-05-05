import { Hardware } from "../../../../common/env/Hardware";

const unix = new RegExp("^(.+)/([^/]+)$");
const windows = /^([a-zA-Z]:)?(\\[^<>:"/\\|?*]+)+\\?$/;

const type = Hardware.isWindows()?"windows":"unix";
export const path = {
    getMessage(field, args) {
      return field+" must me a valid path"
    },
    validate(value, args) {
        if(type == "unix")
            return unix.test(value);
        return windows.test(value);
    }
  };
  