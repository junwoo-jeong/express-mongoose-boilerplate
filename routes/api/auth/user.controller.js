import User from '../../../models/user.model';
import { generateHash, compareHash } from '../../../lib/bcrypt';

export const localRegister = async (req, res) => {
  // hashing password
  console.log(req.params);

  const hash = await generateHash(req.body.password);
  // 
  const user = {
    email: req.body.email,
    name: req.body.name,
    displayName: req.body.displayName,
    password: hash
  };

  try {
    const result = await User.register(user);
    return res.json({
      success: true
    });
  }catch(error){
    throw error;
  }
}