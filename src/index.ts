import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRouter } from "./router/userRoute";
import { postRouter } from "./router/postsRoute";

const app = new Hono();

app.use(cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/posts", postRouter);
export default app;
