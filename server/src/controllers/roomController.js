const roomService = require('../services/roomService');


exports.createRoom = async (req, res) => {
    const { parentId } = req.user; // extracting parentId from JWT payload
    const roomCode = generateUniqueCode();
    const room = await roomService.createRoom(parentId, roomCode);
    res.json(room);
};

exports.deleteRoom = async (req, res) => {
    const { roomId } = req.params;
    const { parentId } = req.user; 
    await roomService.deleteRoom(roomId, parentId);
    res.json({ message: 'Room deleted successfully' });
};

exports.getRoom = async (req, res) => {
    const room = await roomService.getRoom(parseInt(req.params.roomId));
    res.json(room);
};


exports.joinRoom = async (req, res) => {
    const { code } = req.body; // get the code from the request body
     // get the child's name or default to "Anonymous"
     const childId = req.headers['x-child-id'] || req.body.childId || req.query.childId;
    const room = await roomService.joinRoom(code, childId);
    res.json(room);
};


exports.kickChild = async(req, res)=> {
    const { roomId } = req.params;
  
    try {
      const result = await roomService.kickChild(roomId);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }



exports.updateChildName = async (req, res) => {
  const { roomId } = req.params;
  const { newName } = req.body;

  try {
    const result = await roomService.updateChildName(roomId, newName);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

exports.addPoints = async (req, res) => {
  const { roomId } = req.params;
  const { points } = req.body;

  try {
    const result = await roomService.updatePoints(roomId, points);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

exports.deductPoints = async (req, res) => {
  const { roomId } = req.params;
  const { points } = req.body;

  try {
    const result = await roomService.updatePoints(roomId, -points);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


exports.getTaskStatistics = async(req, res) =>{
    const { roomId } = req.params;
  
    try {
      const statistics = await roomService.getTaskStatistics(roomId);
      res.json(statistics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // controllers/roomController.js

  exports.getRewardStatistics = async(req, res) =>{
    const { roomId } = req.params;
  
    try {
      const statistics = await roomService.getRewardStatistics(roomId);
      res.json(statistics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  



function generateUniqueCode() {
    // This is a basic example. You can make this more sophisticated.
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

exports.getTaskHistory = async (req, res) => {
  const { roomId } = req.params;

  try {
    const taskHistories = await roomService.getTaskHistory(roomId);
    res.json(taskHistories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getClaimHistory = async (req, res) => {
  const { roomId } = req.params;

  try {
    const claimHistories = await roomService.getClaimHistory(roomId);
    res.json(claimHistories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
