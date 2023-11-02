const rewardService = require('../services/rewardService');

async function getReward(req, res) {
  try {
    const reward = await rewardService.getReward(req.params.rewardId);
    res.json(reward);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRewardForRoom  (req, res)  {
  const rewards = await rewardService.getRewardForRoom(parseInt(req.params.roomId));
  res.json(rewards);
};



async function claimReward(req, res) {
  try {
    
    const claimHistory = await rewardService.claimReward(parseInt(req.params.rewardId));
    res.json(claimHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function deleteReward(req, res) {
  try {
    await rewardService.deleteReward(req.params.rewardId);
    res.json({ message: 'Reward deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addReward(req, res) {
  try {
    const reward = await rewardService.addReward(req.body);
    res.json(reward);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateReward(req, res) {
  try {
    const reward = await rewardService.updateReward(req.params.rewardId, req.body);
    res.json(reward);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getReward,
  claimReward,
  deleteReward,
  addReward,
  updateReward,
  getRewardForRoom,
};
