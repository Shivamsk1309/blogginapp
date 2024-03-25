import { Hono } from "hono";

import { getPostByTag, getTags } from "../controller/tagsController";

export const tagRouter = new Hono();

tagRouter.get("/getPost/:tag", getPostByTag);
tagRouter.get("/tags", getTags);
