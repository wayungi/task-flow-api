import type { Request, Response } from "express";
import * as TaskService from "../services/tasks.services.js";
import type { Task, UpdateTaskInput } from "../models/task.js";
import { v4 as uuidv4, validate as isUUID } from "uuid";


export const createTask = async(req: Request, res: Response <Task | {message: string}>) : Promise<void> => {
    const { title, description } = req.body;

    const newTask = await TaskService.createTask({
        title,
        ...(description !== undefined ? { description } : {})
    });

    res.status(201).json(newTask);
}


export const getTasks = async (req: Request , res: Response<Task[]>): Promise<void> => {
    const tasks = await TaskService.getTasks();
    res.status(200).json(tasks);
};


export const getTask = async (req: Request , res: Response<Task | {message: string}>): Promise<void> => {
    const { id } = req.params;

    if( typeof id !== "string" || id.trim() === "") {
        res.status(400).json({ message: "Invalid task ID" });
        return;
    }

    const task = await TaskService.getTask(id);

    if (!task) {
        res.status(404).json({ message: "Task not found"});
        return;
    }
        
    res.status(200).json(task);
};


export const updateTask = async (req: Request, res: Response<Task | { message: string }>): Promise<void> => {

    const { id } = req.params;

    if (typeof id !== "string" || !isUUID(id)) {
        res.status(400).json({ message: "Invalid task ID" });
        return;
    }

    const body: unknown = req.body;

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
        res.status(400).json({ message: "Invalid task data" });
        return;
    }

    const { title, description } = body as Record<string, unknown>;

    if (
        (title === undefined && description === undefined) ||
        (title !== undefined && (typeof title !== "string" || title.trim() === "")) ||
        (description !== undefined && description !== null && typeof description !== "string")
    ) {
        res.status(400).json({ message: "Invalid task data" });
        return;
    }

    const changes: UpdateTaskInput = {};

    if (typeof title === "string") {
        changes.title = title;
    }

    if (description === null || typeof description === "string") {
        changes.description = description;
    }

    const updatedTask = await TaskService.updateTask(id, changes);

    if (updatedTask === undefined) {
        res.status(404).json({ message: "Task not found" });
        return;
    }

    res.status(200).json(updatedTask);
};


export const deleteTask = async(req: Request, res: Response<{ message: string }>) => {
    const { id } = req.params;

    if( typeof id !== "string" || id.trim() === "") {
        res.status(400).json({ message: "Invalid task ID" });
        return;
    }

    const isDeleted = await TaskService.deleteTask(id);

    if (!isDeleted) {
        res.status(404).json({ message: "Task not found" });
        return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
};