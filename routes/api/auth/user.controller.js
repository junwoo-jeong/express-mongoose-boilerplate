import User from '../../../models/user.model';
import { generateHash, compareHash } from '../../../lib/bcrypt';
import { isEmail, isPassword, isDisplayName } from '../../../lib/validation';
import { Map, List } from 'immutable';

/*****************************************
*  URL: api/auth/user/signup
*  method: POST
*  data: {
*   name: body.name,
*    displayName: body.displayName,
*    email: body.email,
*    password: body.password
*  }
*****************************************/
export const signup = async (req, res) => {
  const body = req.body;
  let status = Map({
    success: true,
    errors: Map({})
  });

  status = body.email ? status : status.setIn(['errors', 'email'], Map({ message: "이메일이 누락되었습니다."}));
  status = body.name ? status : status.setIn(['errors', 'name'], Map({ message: "이름이 누락되었습니다."}));
  status = body.displayName ? status : status.setIn(['errors', 'displayName'], Map({ message: "닉네임이 누락되었습니다."}));
  status = body.password ? status : status.setIn(['errors', 'password'], Map({ message: "비밀번호가 누락되었습니다."}));

  await User.findByEmail(body.email)
    .then(result => {
      if(!result) {
        status = isEmail(body.email) ? 
          status :
          status.setIn(['errors', 'email'], Map({ message: "사용하실 수 없는 이메일 입니다."}));
      }else {
        status = status.setIn(['errors', 'email'], Map({ message: "이미 가입된 이메일 입니다."}));
      }
  });

  await User.findByDisplayName(body.displayName)
    .then(result => {
      if (!result) {
        status = isDisplayName(body.displayName) ? 
          status :
          status.setIn(['errors', 'displayName'], Map({ message: "사용하실 수 없는 닉네임 입니다."}));  
      }else {
        status = status.setIn(['errors', 'displayName'], Map({ message: "이미 가입된 닉네임 입니다."}));
      }
    });

  status = isPassword(body.password) ? status : status.setIn(['errors', 'password'], Map({ message: "사용하실 수 없는 비밀번호입니다."}));
  
  const isSuccess = !status.get('errors').count();

  if(isSuccess) {
    const hash = await generateHash(body.password);

    const user = {
      email: body.email,
      name: body.name,
      displayName: body.displayName,
      password: hash
    };
    await User.register(user);
    res.json(status.toJSON());
  }else {
    status = status.set('success', false);
    res.json(status.toJSON());
  }
}

/********************************************
*  URL: api/auth/user/signin
*  method: POST
*  data: {
*    email: body.email,
*    password: body.password
*  }
*********************************************/
export const signin = async (req, res) => {
  const body = req.body;
  const user = await User.findByEmail(body.email);
  let status = Map({
    success: true,
    errors: Map({})
  });

  // 이메일 일치 여부 확인
  status = user ? status : status.setIn(['errors', 'email'], Map({message: "이메일이 일치하지 않습니다."}));

  //비밀번호 일치 여부 확인
  const compare = await compareHash(user.password, body.password);

  if(compare){
    //비밀번호가 일치하는 경우
    const access_token = await user.generateToken();
    
    res.cookie('access_token', access_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 
      }
    );
    res.json(status.toJSON());
  } else {
    //비밀번호가 일치하지 않는 경우
    status = status.set('success', false);
    return res.json(status.toJSON());
  }
}
/********************************************
*  URL: api/auth/user/logout
*  method: GET
*********************************************/
export const logout = async (req, res) => {
  if(!req.cookies.access_token){
    return res.json({
      success: false,
      message: "로그인 상태가 아닙니다."
    });
  }
  res.cookie('access_token', null, {
    httpOnly: true,
    maxAge: 0
  });
  res.json({
    success: true,
    message: "로그아웃에 성공했습니다."
  });
}