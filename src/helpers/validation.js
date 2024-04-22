module.exports = {
    validateEmptyFields: (fields) => {
      return fields.some(field => !field);
    },
    
    validateEmailFormat: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    validateMobileFormat: (mobile) => {
      return /^\d+$/.test(mobile);
    }
  };
  