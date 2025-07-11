const Room = require('../models/Room');

const findOrCreateRoom = async (roomName, userId) => {
  let room = await Room.findOne({ name: roomName });

  if (!room) {
    room = await Room.create({ name: roomName, users: [userId] });
  } else if (!room.users.includes(userId)) {
    room.users.push(userId);
    await room.save();
  }

  return room;
};

module.exports = {
  findOrCreateRoom,
};