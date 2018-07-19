import User from '../../../models/user.model';
import { generateHash, compareHash } from '../../../lib/bcrypt';
import jwt from 'jsonwebtoken';


/*
*  URL: api/auth/user/signup
*  method: POST
*  data: {
*   name: body.name,
*    displayName: body.displayName,
*    email: body.email,
*    password: body.password
*  }
*/
export const signup = async (req, res) => {
  const body = req.body;
  
  // checking body property
  if(!(body.email && body.name && body.displayName && body.password)) {
    return res.json({
      success: false,
      message: "필수 항목이 누락되었습니다."
    })
  }
  
  // checking email
  if(await User.findByEmail(body.email)){
    return res.json({
      success: false,
      message: "이미 등록된 이메일 입니다."
    });
  };

  //checking displayName 
  if(await User.findByDisplayName(body.displayName)){
    return res.json({
      success: false,
      message: "이미 등록된 사용자이름 입니다."
    });
  }
  // hashing password
  const hash = await generateHash(req.body.password);
  
  // user schema create 
  const user = {
    email: req.body.email,
    name: req.body.name,
    displayName: req.body.displayName,
    password: hash
  };

  // try user resgister
  try {
    // regist success
    const result = await User.register(user);
    return res.json({
      success: true,
      message: "회원 가입에 성공했습니다."
    });
  }catch(error){
    // regist fail
    throw error;
  }
}

/*
*  URL: api/auth/user/signin
*  method: POST
*  data: {
*    email: body.email,
*    password: body.password
*  }
*/
export const signin = async (req, res) => {
  const body = req.body;
  
  const user = await User.findByEmail(body.email);
  
  // 이메일 일치 여부 확인
  if(!user){
    return res.json({
      success: false,
      message: "아이디가 일치하지 않습니다."
    });
  };

  //비밀번호 일치 여부 확인
  const compare = await compareHash(user.password, body.password);

  if(!compare){
    //비밀번호가 일치하지 않는 경우
    return res.json({
      success: false,
      message: "비밀번호가 일치하지 않습니다."
    });
  } else {
    //비밀번호가 일치하는 경우
    return res.json({
      success: true,
      message: "로그인 성공"
    })
  }
  
}