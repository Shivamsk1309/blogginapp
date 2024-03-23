import { Hono } from "hono";
import { authmiddleware } from "../middleware/user";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
} from "../controller/postsController";

export const postRouter = new Hono();

postRouter.get("/all-posts", getPosts);
postRouter.get("/posts", authmiddleware, getUserPosts);
postRouter.post("/create-post", authmiddleware, createPost);
postRouter.get("/post/:id", authmiddleware, getPost);
postRouter.put("/post/:id", authmiddleware, updatePost);
postRouter.delete("/post/:id", authmiddleware, deletePost);
