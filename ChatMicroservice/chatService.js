// services/messageService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.createMessage = async (text, roomId, senderId, senderType) => {
  const messageData = {
    text: text,
    roomId: parseInt(roomId),
  };

  // Attach the sender ID based on the sender type
  if (senderType === 'parent') {
    messageData.parentId = parseInt(senderId);
  } else if (senderType === 'child') {
    messageData.childId = parseInt(senderId);
  }

  return prisma.message.create({
    data: messageData,
  });
};

exports.getMessagesByRoom = async (roomId) => {
  return prisma.message.findMany({
    where: { roomId: parseInt(roomId) },
    include: {
      parent: true,
      child: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};
    