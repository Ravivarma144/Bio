import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const response = await registerUser(username, password);
    res.json(response);
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const response = await loginUser(username, password);
    res.json(response);
  } catch (error : any) {
    res.status(400).json({ error: error.message });
  }
}
