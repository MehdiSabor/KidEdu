const parentService = require('../services/parentService');

exports.createParent = async (req, res) => {
    const parent = await parentService.createParent(req.body); // request body should be email,name Json
    res.json(parent);
};

exports.getParent = async (req, res) => {
    const parent = await parentService.getParent(req.params.id);
    res.json(parent);
};

exports.getRoomsForParent = async (req, res) => {
   
    const parent = await parentService.getRoomsForParent(req.user.parentId);
    res.json(parent);
};
// ... other functions for Parent

