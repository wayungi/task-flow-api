import type { Request, Response } from "express";
import * as TaskService from "../services/tasks.services";

export const getTasks = async (req: Request , res: Response) => {
    const {id} = req.params;
    const tasks = await TaskService.getTasks(id);
    return res.status(200).json(tasks);
};

export const createTask = async(req: Request, res: Response) => {
    const { title, description } = req.body;
    const newTask = await TaskService.createTask({ title, description });
    return res.status(201).json(newTask);
}

export const updateTask = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedTask = await TaskService.updateTask(id, { title, description });
    return res.status(200).json(updatedTask);
};

export const deleteTask = async(req: Request, res: Response) => {
    const { id } = req.params;
    await TaskService.deleteTask(id);
    return res.status(200).json({ message: "Task deleted successfully" });
};