const { Map, List } = require('immutable');

let message = Map({
  success: false,
  errors: Map({
    email: Map({})
  })
});

message = message.setIn(['errors', 'email'], Map({ message: "이메일이 누락되었습니다."}));
message = message.setIn(['errors', 'asd'], Map({ message: "dasd."}));
message = message.set('success', true);

console.log(message.get('errors').count());

console.log(message.toJSON());

