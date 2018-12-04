export const EmailExists = {
    getMessage(field, params, data) {
        return (data && data.message) || field+ ' is already used by another account';
    },
    validate(value) {
      return new Promise(resolve => {
        api().path('user/email-exists').param('email', value).then((exists)=>{
           resolve({
            valid: !exists,
            data: null
          })
        }, (error)=>{
          resolve({
            valid: false,
            data: error
          });
        })
      });
    }
  };