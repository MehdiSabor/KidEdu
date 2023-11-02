const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');

router.post('/create', childController.createChild);
router.get('/get:id', childController.getChildById);
router.patch('/updateName/:id', childController.updateChildName);
router.delete('/delete/:id', childController.deleteChild);

module.exports = router;
