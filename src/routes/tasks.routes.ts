import { Router } from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/tasks.controller.js';
import { createTaskSchema, updateTaskSchema, taskParamsSchema } from '../validators/task.schema.js'
import { validate } from '../middleware/validate.js';


const router = Router();

router.get(
    '/', 
    getTasks
);


router.get(
    '/:id', 
    validate(taskParamsSchema, "params")
    ,getTask
);


router.post(
    '/',
    validate(createTaskSchema, "body"),
    createTask
);


router.patch(
    '/:id',
    validate(taskParamsSchema, "params"),
    validate(updateTaskSchema, "body"),
    updateTask
);


router.delete(
    '/:id',
    validate(taskParamsSchema, "params"),
    deleteTask
);

export default router;


