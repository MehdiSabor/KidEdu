const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getReward = async (id) => {
  return await prisma.reward.findUnique({
    where: { id: parseInt(id) },
  });
};

const claimReward = async (rewardId) => {
  const reward = await prisma.reward.findUnique({
    where: { id: parseInt(rewardId) }
  });
  if (!reward) {return res.status(404).json({ error: 'Reward not found.' });
   }

  const room = await prisma.room.findUnique({
    where: { id: reward.roomId }
  });

  if (!room) {
    throw new Error('Room not found.');
  }

  console.log(room);
  console.log(reward);

  if (room.total < reward.points) {
    throw new Error('Not enough points to claim the reward');
  }

  await prisma.room.update({
    where: { id: room.id },
    data: { total: room.total - reward.points },
  });

  return await prisma.claimHistory.create({
    data: {
      rewardId,
      roomId: room.id,
    },
  });
};

const deleteReward = async (id) => {
  return await prisma.reward.delete({
    where: { id: parseInt(id) },
  });
};

const addReward = async (data) => {
  return await prisma.reward.create({ data });
};

const updateReward = async (id, data) => {
  return await prisma.reward.update({
    where: { id: parseInt(id) },
    data,
  });
};
const getRewardForRoom = async (roomId) => {
  return await prisma.reward.findMany({
      where: { roomId }
  });
};


module.exports = {
  getReward,
  claimReward,
  deleteReward,
  addReward,
  getRewardForRoom,
  updateReward,
};
