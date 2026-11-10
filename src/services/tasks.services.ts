import { v4 as uuidv4, validate as isUUID } from "uuid";
import type { Task, TaskStatus, TaskData } from "../models/task.js";

const taskArray:Task[] = []

const createTask = async (taskData: TaskData) => {
    const { title, description } = taskData;
    const newTask = {
        "id":uuidv4(),
        "title": title,
        "description": description,
        "status": "TODO" as TaskStatus,
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    };
    taskArray.push(newTask);
    //const newTask = await TaskModel.create({ title, description });
    return newTask;
};


const getTasks = async () => {
    //const tasks = await TaskModel.find();
    return taskArray;
};

const getTask = async (id: string) => {
    const task = taskArray.find(task => task.id === id);
    //const task = await TaskModel.findById(id);
    return task;
};

const updateTask = async (id: string, taskData: TaskData) => {
    if(typeof id !== "string" || id.trim() === "" || !isUUID(id)) {
        throw new Error("Invalid task ID");
    }

    const { title, description } = taskData;

    //const updatedTask = await TaskModel.findByIdAndUpdate(id, { title, description }, { new: true });
    const taskIndex = taskArray.findIndex(task => task.id === id);

    const task = taskArray.find(task => task.id === id);
    if (!task) {return null }

    if (taskIndex !== -1) {
        taskArray[taskIndex] = { ...task, title, description, updatedAt: new Date().toISOString() };
        return taskArray[taskIndex];
    }
    return null;
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