const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:{ type: String,required:true,unique:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add any other fields you need for the user model
});

const UsersModal = mongoose.model('users', UserSchema);

module.exports = UsersModal;

