import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { log } from "console";

import { Context } from "hono";

enum StatusCode {
  BADREQ = 400,
  NOTFOUND = 404,
  NOTPERMISSIOON = 403,
}
export const getPosts = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const response = await prisma.posts.findMany({
      include: {
        User: true,
        tags: true,
      },
    });

    return c.json({
      posts: response.map((post) => ({
        id: post.id,
        userId: post.userId,
        title: post.title,
        body: post.body,
        createdAt: post.createdAt,
        username: post.User.username,
      })),
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: `Internal server error : ${err}` }, 500);
  }
};

export const createPost = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");
    const body: {
      title: string;
      body: string;
    } = await c.req.json();

    if (!body.body || !body.title) {
      return c.json(
        { error: `Title and body are required` },
        StatusCode.BADREQ
      );
    }

    const crtPost = await prisma.posts.create({
      data: {
        title: body.title,
        body: body.body,
        User: { connect: { id: userId } },
      },
    });
    console.log(crtPost);
    return c.json({ message: "Post Created Succesfully", post: crtPost });
  } catch (err) {
    console.error(err);
    return c.json({ error: `Internal server error : ${err}` }, 500);
  }
};

export const deletePost = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const postId: number = parseInt(c.req.param("id"));
    const findPost = await prisma.posts.findFirst({
      where: {
        id: postId,
        userId: c.get("userId"),
      },
    });
    if (!findPost) {
      return c.json({ error: `Post not found` }, StatusCode.NOTFOUND);
    }
    const deletePost = await prisma.posts.delete({
      where: {
        id: postId,
        userId: c.get("userId"),
      },
    });
    return c.json({ message: "Post Deleted Succesfully" });
  } catch (err) {
    console.error(err);
    return c.json({ error: `Internal server error : ${err}` }, 500);
  }
};

export const getPost = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const postId: number = parseInt(c.req.param("id"));
    const findPost = await prisma.posts.findFirst({
      where: {
        id: postId,
        userId: c.get("userId"),
      },
    });
    if (!findPost) {
      return c.json({ error: `Post not found` }, StatusCode.NOTFOUND);
    }
    return c.json({ post: findPost });
  } catch (err) {
    console.error(err);
    return c.json({ error: `Internal server error : ${err}` }, 500);
  }
};

export const getUserPosts = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
  } catch (err) {
    console.error(err);
    return c.json({ error: `Internal server error : ${err}` }, 500);
  }
};

export const updatePost = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
  } catch (err) {
    console.error(err);
    return c.json({ error: `Internal server error : ${err}` }, 500);
  }
};
