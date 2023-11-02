const taskService = require('../services/taskService');

exports.createTask = async (req, res) => {
    const task = await taskService.createTask(req.body);
    res.json(task);
};

exports.deleteTask = async (req, res) => {
    await taskService.deleteTask(req.params.taskId);
    res.json({ message: 'Task deleted successfully' });
};

exports.updateTask = async (req, res) => {
    const updatedTask = await taskService.updateTask(parseInt(req.params.taskId), req.body);
    res.json(updatedTask);
};
exports.getTaskForRoom = async (req, res) => {
    const tasks = await taskService.getTaskForRoom(parseInt(req.params.roomId));
    res.json(tasks);
};


exports.completeTask = async (req, res) => {
    const { taskId } = req.params;
    const task = await taskService.completeTask(parseInt(taskId));
    res.json(task);
}


exports.confirmTask = async (req, res) => {
    const { taskId } = req.params;
    const task = await taskService.confirmTask(parseInt(taskId));
    res.json(task);
}


exports.rejectTask = async (req, res) => {
    const { taskId } = req.params;
    const task = await taskService.rejectTask(parseInt(taskId));
    res.json(task);
}
