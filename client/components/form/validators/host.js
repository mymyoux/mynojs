const regexps = 
{
    "ip":new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$"),
    "host":new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$")
};


export const host = {
    getMessage(field, args) {
      return field+" must me a valid IP or a Hostname"
    },
    validate(value, args) {
      if(!args || !args.length)
      {
          args = ["host", "ip"];
      }
      if(~args.indexOf("ip"))
      {
          if(regexps.ip.test(value))
          {
              return true;
          }
      }
      if(~args.indexOf("host"))
      {
          if(regexps.host.test(value))
          {
              return true;
          }
      }
      return false;
    }
  };
  