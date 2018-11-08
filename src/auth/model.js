import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user', enum: ['admin', 'editor', 'user'] },
});

const capabilities = {
  user: ['read'],
  editor: ['create', 'read', 'update'],
  admin: ['create', 'read', 'update', 'delete'],
};

//hash the users password and populate this.password with the hashed password
schema.pre('save', async function () {
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error;
  }
});

schema.method.can = function (capability) {
  return capabilities[this.role].includes(capability);
};

schema.statics.authenticateBasic = function (auth) {
  let query = { username: auth.username };
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(error => error);
};

schema.statics.authenticateToken = function (token) {
  let parsedToken = jwt.verify(token, process.env.SECRET);
  let query = { _id: parsedToken.id };
  return this.findOne(query)
    .then(user => {
      return user;
    })
    .catch(error => error);
};

schema.methods.generateToken = function () {
  const tokenData = {
    id: this._id,
    capabilities: capabilities[this.role],
  };
  return jwt.sign(tokenData, process.env.APP_SECRET);
};

schema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};


export default mongoose.model('User', schema);