import { Hono } from "hono";
import { getAllUsers, signIn, signup } from "../controller/userController";

export const userRouter = new Hono();

userRouter.post("/signup", signup);
userRouter.post("/signin", signIn);
// userRouter.get("/all-users", getAllUsers);
