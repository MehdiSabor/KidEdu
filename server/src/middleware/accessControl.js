const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();


function isParentOfRoom(req, res, next) {
    const parentId = req.user.parentId;
    const roomId = req.params.roomId || req.body.roomId;

    prisma.room.findFirst({
        where: {
            id: roomId,
            parentId: parentId
        }
    }).then(room => {
        if (!room) {
            return res.status(403).json({ error: 'Access denied. Parent not owner of the room.' });
        }
        next();
    });
}



async function ensureChildProfile(req, res, next) {
  try {
    const childId = req.headers['x-child-id'] || req.body.childId || req.query.childId;

    if (!childId) {
      return res.status(400).json({ error: 'Child ID is required' });
    }

    const childProfile = await prisma.child.findUnique({
      where: { id: parseInt(childId) },
    });

    if (!childProfile) {
      return res.status(404).json({ error: 'Child profile not found' });
    }

    req.child = childProfile;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}




async function isChildOfRoom(req, res, next) {
    const childIdFromHeader = req.headers['x-child-id'];
    let childId;
    let roomId = parseInt(req.params.roomId);

    
    try {
      
      if (childIdFromHeader) {
        userId = parseInt(childIdFromHeader);
        next(); // Continue if successful
      } else {
        throw new Error('Child ID required in x-child-id header');
      }
    } catch (error) {
      next(error); // Pass any caught errors to the error-handling middleware
    }
  

    if(req.params.taskId) {
        const taskId = parseInt(req.params.taskId);
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: { roomId: true }
        });
        if(task) roomId = task.roomId;
        else return res.status(404).json({ error: 'Task not found.' });
    }

    if (!roomId) {
        return res.status(400).json({ error: 'Room ID or Task ID must be provided.' });
    }

    try {
        console.log(`Checking access for child ID: ${childId}, Room ID: ${roomId}`);
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                roomId: roomId
            }
        });
        console.log('Query result:', child);

        if (!child) {
            return res.status(403).json({ error: 'Access denied. Child not part of the room.' });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}



async function belongsToRoom(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  const childIdFromHeader = req.headers['x-child-id'];
  let userId;
  
  let roomId = parseInt(req.params.roomId);

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      if (decodedToken.parentId) {
        userId = decodedToken.parentId;
      } else {
        return res.status(403).json({ error: 'Access denied. Not a parent.' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } else if (childIdFromHeader) {
    userId = parseInt(childIdFromHeader);
    console.log(userId);
  } else {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if(req.params.taskId) {
    const taskId = parseInt(req.params.taskId);
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { roomId: true }
    });
    if(task) roomId = task.roomId;
    else return res.status(404).json({ error: 'Task not found.' });
}
if (req.params.rewardId) {
    const rewardId = parseInt(req.params.rewardId);
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
      select: { roomId: true }
    });
    if (reward) roomId = reward.roomId;
    else return res.status(404).json({ error: 'Reward not found.' });
  }

if (!roomId) {
    return res.status(400).json({ error: 'Room ID or Task ID must be provided.' });
}

  try {
    if (token) {
      // User is a parent, check if parent is part of the room
      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
          parentId: userId
        }
      });
      req.user = userId;

      if (!room) {
        return res.status(403).json({ error: 'Access denied. Parent not owner of the room.' });
      }
    } else {
      // User is a child, check if child is part of the room
     
      console.log(`Checking access for child ID: ${userId}, Room ID: ${roomId}`);
      const child = await prisma.child.findFirst({
        where: {
          id: parseInt(userId),
          roomId: roomId
        }
      });
      console.log('Query result:', child);

      if (!child) {
        return res.status(403).json({ error: 'Access denied. Child not part of the room.' });
      }
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}





module.exports = {
    isParentOfRoom,
    isChildOfRoom,
    belongsToRoom,
  ensureChildProfile
};
