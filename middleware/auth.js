import { generateToken, verifyToken } from '../lib/auth';

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.access_token;
  
  // 토큰이 있는지 없는지 확인
  if(!token){
    res.json({
      success: false,
      message: '비로그인 상태 입니다.'
    })
    return res.end();
  }

  try{
    const decoded = await verifyToken(token);
    const { user } = decoded;
    if(Date.now() / 1000 - decoded.iat > 60 * 60 * 24 * 3){
      const freshToken = await generateToken({ user }, 'user');
      res.cookie('access_token', freshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7
      });
    };
  }catch(err) {
    res.cookie('access_token', null, {
      httpOnly: true,
      maxAge: 0
    });
    return res.end();
  }
  return next();
}