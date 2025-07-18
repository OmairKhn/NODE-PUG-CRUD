const User = require('../db/user.js');
const bcrypt = require('bcrypt');

async function addUser(userModel) {
  if (userModel.Password) {
    userModel.Password = await bcrypt.hash(userModel.Password, 10);
  }
  let user = new User({ ...userModel });
  await user.save();
  return user.toObject();
}

async function findUserByEmail(email) {
  return await User.findOne(email);
}
// async function getUsers(page = 1, limit = 5) {
//   const skip = (page - 1) * limit;
//   const total = await User.countDocuments();
//   const users = await User.find().skip(skip).limit(limit);
//   return {
//     data: users.map(user => user.toObject()),
//     total,
//     page,
//     totalPages: Math.ceil(total / limit)
//   };
// }

// async function getUser(id) {
//   const user = await User.findById(id);
//   if (!user) return null;
//   return user.toObject();
// }

// async function updateUser(id, userModel) {
//   const filter = { _id: id };
//   const updatedUser = await User.findOneAndUpdate(filter, userModel, { new: true });
//   return updatedUser ? updatedUser.toObject() : null;
// }

// async function deleteUser(id) {
//   const user = await User.findByIdAndDelete(id);
//   return user ? user.toObject() : null;
// }

module.exports = { addUser, findUserByEmail };