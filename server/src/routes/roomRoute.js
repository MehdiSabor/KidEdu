const express = require('express');
const roomController = require('../controllers/roomController');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = express.Router();
const { belongsToRoom, ensureChildProfile} = require('../middleware/accessControl');



router.post('/create', authenticateJWT, roomController.createRoom);
router.delete('/delete/:roomId',belongsToRoom, authenticateJWT, roomController.deleteRoom);
router.post('/join', ensureChildProfile, roomController.joinRoom);
router.get('/get/:roomId', belongsToRoom, roomController.getRoom);
router.delete('/kick/:roomId', authenticateJWT, belongsToRoom, roomController.kickChild);
router.put('/updateChildName/:roomId', belongsToRoom, roomController.updateChildName);
router.put('/addPoints/:roomId', authenticateJWT, belongsToRoom, roomController.addPoints);
router.put('/deductPoints/:roomId', authenticateJWT, belongsToRoom, roomController.deductPoints);
router.get('/:roomId/reward-statistics',  belongsToRoom, roomController.getRewardStatistics);
router.get('/:roomId/task-statistics',  belongsToRoom, roomController.getTaskStatistics);
router.get('/:roomId/task-history',  belongsToRoom, roomController.getTaskHistory);
router.get('/:roomId/claim-history',  belongsToRoom, roomController.getClaimHistory);






module.exports = router;