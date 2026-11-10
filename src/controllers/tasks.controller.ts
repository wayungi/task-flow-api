import type { Request, Response } from "express";
import * as TaskService from "../services/tasks.services.js";

export const getTasks = async (req: Request , res: Response) => {
    const tasks = await TaskService.getTasks();
    return res.status(200).json(tasks);
};


export const getTask = async (req: Request , res: Response) => {
    const { id } = req.params;
    if( typeof id === "string" && id.trim() !== "") {
        const tasks = await TaskService.getTask(id);
        return res.status(200).json(tasks);
    }else{
        return res.status(400).json({ message: "Invalid task ID" });
    }
};


export const createTask = async(req: Request, res: Response) => {
    const { title, description } = req.body;
    if(
        typeof title !== "string" || 
        title.trim() === "" || 
        typeof description !== "string" || 
        description.trim() === "") {
        return res.status(400).json({ message: "Title and description are required" });
    }
    const newTask = await TaskService.createTask({ title, description });
    return res.status(201).json(newTask);
}


export const updateTask = async(req: Request, res: Response) => {
    const { id } = req.params;
    if( typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    const { title, description } = req.body;
    if(
        typeof title !== "string" || 
        title.trim() === "" || 
        typeof description !== "string" || 
        description.trim() === "") {
        return res.status(400).json({ message: "Title and description are required" });
    }

    const updatedTask = await TaskService.updateTask(id, { title, description });
    return res.status(200).json(updatedTask);
};


export const deleteTask = async(req: Request, res: Response) => {
    const { id } = req.params;
      if( typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    await TaskService.deleteTask(id);
    return res.status(200).json({ message: "Task deleted successfully" });
};