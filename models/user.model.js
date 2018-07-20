import mongoose, { Schema } from 'mongoose';
import {generateToken, vertifyToken } from '../lib/auth';

const User = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  profileImg: { type: String },
  introduction: { type: String },
  tel: { type: String },
  gender: { type: String },
  createAt: { type: Date, default: Date.now },
});

 
/*********************** statics *************************/

User.statics.findByDisplayName = function(displayName) {
  return this.findOne({
    displayName: displayName
  })
}

User.statics.findByEmail = function(email) {
  return this.findOne({
    email: email
  });
};

User.statics.register = function ({
  email, password, name, displayName,
}) {
  const user = new this({
    _id: new mongoose.Types.ObjectId(),
    email,
    password,
    name,
    displayName,
  });
  return user.save();
};

User.methods.generateToken = function() {
  const {_id, displayName } = this;
  return generateToken({
    user: {
      _id,
      displayName
    }
  }, 'user');
};

module.exports = mongoose.model('User', User);
