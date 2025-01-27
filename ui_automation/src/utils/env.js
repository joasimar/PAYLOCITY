import dotenv from 'dotenv';
dotenv.config(); 

export default {
  login: {
    account: process.env.ACCOUNT,  
    password: process.env.PASSWORD,  
  },
  url: process.env.LOGIN_URL,  
};
