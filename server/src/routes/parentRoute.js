const express = require('express');
const parentController = require('../controllers/parentController');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = express.Router();

router.post('/create', parentController.createParent);
router.get('/get/:id',authenticateJWT,  parentController.getParent);
router.get('/rooms',authenticateJWT,  parentController.getRoomsForParent);
// ... other routes related to Parent

module.exports = router;




