const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cron = require('node-cron');

const createTask = async (data) => {
    return await prisma.task.create({ data });
};

const deleteTask = async (taskId) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    console.log(task)
;    if (!task) {
        throw new Error('Task not found');
    }

    return await prisma.task.delete({
        where: { id: parseInt(taskId) }
    });
}
;

const updateTask = async (id, data) => {
    return await prisma.task.update({
        where: { id },
        data
    });
};

const getTaskForRoom = async (roomId) => {
    return await prisma.task.findMany({
        where: { roomId }
    });
};




cron.schedule('0 0 * * *', async () => {  // This runs every day at midnight
    await prisma.task.updateMany({
        where: {},
        data: { status: 'PENDING' }
    });
});


const completeTask = async (taskId) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
        throw new Error('Task not found');
    }

    await prisma.task.update({
        where: { id: taskId },
        data: { status: 'COMPLETED' }
    });

    return prisma.taskHistory.create({
        data: {
            taskId: task.id,
            roomId: task.roomId,
            status: 'COMPLETED'
        }
    });

    
}


const confirmTask = async (taskId) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
        throw new Error('Task not found');
    }

    // Update task status
    await prisma.task.update({
        where: { id: taskId },
        data: { status: 'CONFIRMED' }
    });

    // Add points to room
    await prisma.room.update({
        where: { id: task.roomId },
        data: { total: { increment: task.points } }
    });

    return prisma.taskHistory.create({
        data: {
            taskId: task.id,
            roomId: task.roomId,
            status: 'CONFIRMED'
        }
    });

    
}

const rejectTask = async (taskId) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
        throw new Error('Task not found');
    }

    await prisma.task.update({
        where: { id: taskId },
        data: { status: 'REJECTED' }
    });

    return prisma.taskHistory.create({
        data: {
            taskId: task.id,
            roomId: task.roomId,
            status: 'REJECTED'
        }
    });

    
}



module.exports = {
    createTask,
    deleteTask,
    updateTask,
    getTaskForRoom,
    confirmTask,
    completeTask,
    rejectTask
};
