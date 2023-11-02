const childService = require('../services/childService');

exports.createChild = async (req, res) => {
  try {
    const { name } = req.body;
    const child = await childService.createChild(name);
    res.status(201).json(child);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getChildById = async (req, res) => {
  try {
    const { childId } = req.params;
    const child = await childService.getChildById(id);
    if (!child) return res.status(404).json({ error: 'Child not found' });
    res.json(child);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateChildName = async (req, res) => {
  try {
    const { childId } = req.params;
    const { newName } = req.body;
    const updatedChild = await childService.updateChildName(id, newName);
    res.json(updatedChild);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteChild = async (req, res) => {
  try {
    const { childId } = req.params;
    await childService.deleteChild(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
