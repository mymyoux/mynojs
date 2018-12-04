export const UsernameExists = {
    getMessage(field, params, data) {
        return (data && data.message) || field+ ' is already used by another account';
    },
    validate(value) {
      return new Promise(resolve => {
        api().path('user/username-exists').param('name', value).then((exists)=>{
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