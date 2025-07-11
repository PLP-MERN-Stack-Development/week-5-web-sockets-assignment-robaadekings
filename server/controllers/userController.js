const User = require('../models/User');

const findOrCreateUser = async (username, socketId) => {
  let user = await User.findOne({ username });

  if (!user) {
    user = await User.create({ username, socketId, online: true });
  } else {
    user.socketId = socketId;
    user.online = true;
    await user.save();
  }

  return user;
};

const setUserOffline = async (socketId) => {
  const user = await User.findOne({ socketId });
  if (user) {
    user.online = false;
    await user.save();
  }
  return user;
};

module.exports = {
  findOrCreateUser,
  setUserOffline,
};