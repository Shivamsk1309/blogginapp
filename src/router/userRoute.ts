import { Hono } from "hono";
import { signup } from "../controller/userController";

export const userRouter = new Hono();

userRouter.post("/signup", signup);
