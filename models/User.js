const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // 引入 validator 来校验邮箱

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // 将邮箱存为小写
    validate: [validator.isEmail, 'Please provide a valid email'] // 使用 validator 来校验邮箱
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;