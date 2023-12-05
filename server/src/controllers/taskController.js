const taskService = require('../services/taskService');

exports.createTask = async (req, res) => {
    const task = await taskService.createTask(req.body);
    res.json(task);
};

exports.deleteTask = async (req, res) => {
    console.log("delete",req.params);
    await taskService.deleteTask(parseInt(req.params.taskId));
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
    try{ 
        const task = await taskService.completeTask(parseInt(taskId));
        res.status(200).json({task, message: 'Task completed successfully' });
    }
        catch (error) {
            // If a response has already been sent, do not send another one
            if (!res.headersSent) {
              res.status(500).json({ error: error.message });
            }
          }
   
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
