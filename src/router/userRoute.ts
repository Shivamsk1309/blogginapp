import { Hono } from "hono";
import { signIn, signup } from "../controller/userController";

export const userRouter = new Hono();

userRouter.post("/signup", signup);
userRouter.post("/signin", signIn);
