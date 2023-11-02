const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateJWT = require ('../middleware/authenticateJWT');
const { belongsToRoom, isParentOfRoom, isChildOfRoom } = require('../middleware/accessControl');

router.post('/create', authenticateJWT, isParentOfRoom, taskController.createTask);
router.delete('/delete/:taskId', authenticateJWT, isParentOfRoom, taskController.deleteTask);
router.put('/update/:taskId', authenticateJWT, isParentOfRoom, taskController.updateTask);
router.get('/getall/:roomId', belongsToRoom, taskController.getTaskForRoom);
router.patch('/complete/:taskId', isChildOfRoom, taskController.completeTask);
router.patch('/confirm/:taskId', authenticateJWT, belongsToRoom, taskController.confirmTask);
router.patch('/reject/:taskId', authenticateJWT, belongsToRoom, taskController.rejectTask);


module.exports = router;
