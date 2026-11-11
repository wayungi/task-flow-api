import { v4 as uuidv4, validate as isUUID } from "uuid";
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from "../models/task.js";

const taskArray:Task[] = []


const createTask = async (taskData: CreateTaskInput): Promise<Task> => {
    const { title, description } = taskData;
    const now = new Date().toISOString();
    const newTask: Task = {
        "id":uuidv4(),
        "title": title,
        "description": description,
        "status": "TODO",
        "createdAt": now,
        "updatedAt": now
    };
    taskArray.push(newTask);
    //const newTask = await TaskModel.create({ title, description });
    return {...newTask };
};


const getTasks = async (): Promise<Task[]> => {
    //const tasks = await TaskModel.find();
    return taskArray.map(task => ({ ...task }));
};


const getTask = async (id: string): Promise<Task | undefined> => {
    const task = taskArray.find(task => task.id === id);
    //const task = await TaskModel.findById(id);
    return task ? { ...task } : undefined;
};


const updateTask = async (id: string, taskData: UpdateTaskInput) : Promise<Task | undefined> => {

    if(typeof id !== "string" || id.trim() === "" || !isUUID(id)) {
        throw new Error("Invalid task ID");
    }

    const taskIndex = taskArray.findIndex(task => task.id === id);
    if(taskIndex === -1) { return undefined;}

    const existingTask = taskArray[taskIndex];
     if (!existingTask) {return undefined;}

    const updatedTask: Task = {
        ...existingTask,
        ...(taskData.title !== undefined && {
            title: taskData.title
        }),
        ...(taskData.description !== undefined && {
            description: taskData.description
        }),
        updatedAt: new Date().toISOString()
    };

    taskArray[taskIndex] = updatedTask;

    return { ...updatedTask };

    //const updatedTask = await TaskModel.findByIdAndUpdate(id, { title, description }, { new: true });

};


const deleteTask = async (id: string) => {
    //await TaskModel.findByIdAndDelete(id);
    const taskIndex = taskArray.findIndex(task => task.id === id);

    if (taskIndex !== -1) {
        taskArray.splice(taskIndex, 1);
        return true;
    }
    return false;   
};

export { createTask, getTasks, getTask, updateTask, deleteTask };