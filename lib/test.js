const {Map} = require('immutable');

const data = {
  "email": "wnsdnek778naver.com",
  "displayName": "asdasd",
  "password": "123123",
  "name": "정준우" 
}

const p = (message, data) => {
  return new Promise(
    (resolve, reject) => {
      console.log(data);
      
      resolve(message, data);
    }
  )
}

const p2 = (message, data) => {
  return new Promise(
    (resolve, reject) => {
      const regexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
      if(regexp.test(data.email)){
        message = "이메일 맞음";
      }else {
        message = "이메일 아님";
      }
      resolve(message, data);
      if(false) {
        reject(err);
      }
    }
  )
}
p("", data).then(p2).then((message, data) => {
  console.log(message);
  console.log(data);
})
const vertifyEmail = (email) => {
  const regexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  return regexp.test(email);
}
