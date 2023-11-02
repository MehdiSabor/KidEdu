const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const  authenticateJWT  = require('../middleware/authenticateJWT');
const { belongsToRoom,isParentOfRoom} = require('../middleware/accessControl');

router.get('/get/:rewardId', belongsToRoom,  rewardController.getReward);
router.post('/claim/:rewardId', belongsToRoom, rewardController.claimReward);
router.delete('/delete/:rewardId', authenticateJWT,belongsToRoom, rewardController.deleteReward);
router.post('/create', authenticateJWT,isParentOfRoom, rewardController.addReward);
router.put('/update/:rewardId', authenticateJWT,belongsToRoom, rewardController.updateReward);
router.get('/getall/:roomId', belongsToRoom, rewardController.getRewardForRoom);

module.exports = router;
