const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createRoom = async (parentId, code) => {
    
    return prisma.room.create({
        data: {
            code,
            parent: {
                connect: {
                    id: parentId
                }
            }
        }
    });
};

exports.deleteRoom = async (roomId, parentId) => {
    const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
    
    if (!room) {
        throw new Error('Room not found.');
    }
    
    if (room.parentId !== parentId) {
        throw new Error('Unauthorized to delete this room.');
    }
    
    return prisma.room.delete({ where: { id: parseInt(roomId) } });
};



exports.joinRoom = async (code, childId) => {
  const room = await prisma.room.findUnique({ 
    where: { code },
    include: { child: true }  // Include the child details
  });
  if (!room) {
    throw new Error("Invalid room code");
  }

  console.log(room);
  // Check if the room already has a child and if the IDs are the same
  if (room.child && room.child.id !== parseInt(childId)) {
    throw new Error("Room is for another child");
  }




  const child = await prisma.child.update({
    where: { id: parseInt(childId) },
    data: {
      room: {
        connect: {
          id: room.id,

        },
      },
    },
  });

  return { room, child };
};


exports.getRoom= async (roomId) => {
    return await prisma.room.findUnique({
        where: { id: roomId },
        include: { child: true }
    });
};




exports.kickChild = async (roomId) => {
  // Find the child in the specified room
  const child = await prisma.child.findFirst({
    where: { roomId: parseInt(roomId) },
  });

  if (!child) {
    throw new Error('No child found in the specified room');
  }

  // Remove the child from the room
  await prisma.child.update({
    where: { id: child.id },
    data: { roomId: null },  // Set roomId to null to disconnect the child from the room
  });

  return { message: 'Child successfully removed from the room' };
};


 exports.updateChildName = async (roomId, newName) => {
    // Find the child in the specified room
    const child = await prisma.child.findFirst({
      where: { roomId: parseInt(roomId) },
    });
  
    if (!child) {
      throw new Error('No child found in the specified room');
    }
  
    // Update the child's name
    await prisma.child.update({
      where: { id: child.id },
      data: { name: newName },
    });
  
    return { message: 'Child’s name updated successfully' };
  };
  
exports.updatePoints = async (roomId, points) => {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
    });
  
    if (!room) {
      throw new Error('Room not found');
    }
  
    const updatedTotal = room.total + parseInt(points);
  
    if (updatedTotal < 0) {
      throw new Error('Insufficient points');
    }
  
    // Update the room's total points
    await prisma.room.update({
      where: { id: parseInt(roomId) },
      data: { total: updatedTotal },
    });
  
    return { message: 'Points updated successfully', total: updatedTotal };
  };



  exports.getTaskStatistics = async (roomId) => {
    const roomIdInt = parseInt(roomId);
  
    const totalTasks = await prisma.task.count({
      where: { roomId: roomIdInt },
    });
  
    const tasksConfirmed = await prisma.taskHistory.count({
      where: { roomId: roomIdInt, status: 'CONFIRMED' },
    });
  
    const tasksPending = totalTasks - tasksConfirmed;
  
    const averageCompletionTime = await getAverageTaskCompletionTime(roomIdInt);
  
    const mostCommonTaskId = await prisma.taskHistory.groupBy({
      by: ['taskId'],
      where: { roomId: roomIdInt },
      _count: true,
      orderBy: { _count: {taskId:'desc'} },
      take: 1,
    }).then(result => result[0]?.taskId);
  
    const mostCommonTask = mostCommonTaskId 
      ? await prisma.task.findUnique({ where: { id: mostCommonTaskId }})
      : null;
  
    const latestCompletedTask = await prisma.taskHistory.findFirst({
      where: { roomId: roomIdInt, status: 'COMPLETED' },
      orderBy: { changedAt: 'desc' },
      include: { task: true },
    });
  
    return {
      totalTasks,
      tasksConfirmed,
      tasksPending,
      averageCompletionTime: averageCompletionTime || 0,
      mostCommonTask: mostCommonTask?.title || 'None',
      latestCompletedTask: latestCompletedTask?.task?.title || 'None',
    };
  };
  
  const getAverageTaskCompletionTime = async (roomId) => {
    const completedTasks = await prisma.taskHistory.findMany({
      where: {
        roomId,
        status: 'COMPLETED',
      },
      include: {
        task: true,
      },
    });
  
    if (completedTasks.length === 0) return null;
  
    let totalCompletionTime = 0;
    for (const completedTask of completedTasks) {
      const nextConfirmation = await prisma.taskHistory.findFirst({
        where: {
          roomId,
          taskId: completedTask.taskId,
          changedAt: {
            gt: completedTask.changedAt,
          },
          status: 'CONFIRMED',
        },
        orderBy: {
          changedAt: 'asc',
        },
      });
  
      if (!nextConfirmation) continue;
  
      const completionTime = nextConfirmation.changedAt - completedTask.changedAt;
      totalCompletionTime += completionTime;
    }
  
    const averageCompletionTime = totalCompletionTime / completedTasks.length;
    return averageCompletionTime; // in milliseconds
  };
  
  

  // services/roomService.js

  exports.getRewardStatistics = async (roomId) => {
    const roomIdInt = parseInt(roomId);
  
    const totalRewards = await prisma.reward.count({
      where: { roomId: roomIdInt },
    });
  
    const rewardsClaimed = await prisma.claimHistory.count({
      where: { roomId: roomIdInt },
    });
  
    const averagePointsPerReward = await prisma.reward.aggregate({
      _avg: { points: true },
      where: { roomId: roomIdInt },
    });
  
    const mostClaimedReward = await prisma.claimHistory.groupBy({
      by: ['rewardId'],
      where: {
        roomId: roomIdInt
      },
      _count: true,
      orderBy: {
        _count: {
          rewardId: 'desc',
        }
      },
      take: 1,
    });
    
    if (mostClaimedReward.length > 0) {
      const rewardId = mostClaimedReward[0].rewardId;
      const reward = await prisma.reward.findUnique({
        where: { id: rewardId },
      });
      mostClaimedReward[0].reward = reward;
    }
    
    
    
    
  
    return {
      totalRewards,
      rewardsClaimed,
      averagePointsPerReward: averagePointsPerReward._avg.points || 0,
      mostClaimedReward: mostClaimedReward[0]?.reward.name || 'None',
    };
  };
  

  exports.getTaskHistory = async (roomId) => {
    const taskHistories = await prisma.taskHistory.findMany({
      where: { roomId: parseInt(roomId) },
      include: { task: true } 
    });
    return taskHistories;
  };
  
  exports.getClaimHistory = async (roomId) => {
    const claimHistories = await prisma.claimHistory.findMany({
      where: { roomId: parseInt(roomId) },
      include: { reward: true } 
    });
    return claimHistories;
  };
  



