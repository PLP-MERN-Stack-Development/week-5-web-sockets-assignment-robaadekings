const Message = require('../models/Message');

const createRoomMessage = async (content, senderId, roomId) => {
  const message = await Message.create({
    content,
    sender: senderId,
    room: roomId,
  });

  return message;
};

module.exports = {
  createRoomMessage,
};