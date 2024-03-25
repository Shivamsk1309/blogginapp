import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

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
    const userPosts = await prisma.posts.findMany({
      where: {
        userId: c.get("userId"),
      },
    });
    if (!userPosts)
      return c.json(
        { error: "No posts, Start with creating new posts!" },
        StatusCode.NOTFOUND
      );
    return c.json({
      post: userPosts,
    });
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
    const userId = c.get("userId");
    const postId = c.req.param("id");
    const isPostExist = await prisma.posts.findFirst({
      where: {
        id: parseInt(c.req.param("id")),
        userId: userId,
      },
    });
    if (!isPostExist)
      return c.json({
        error: `Cant find post with id : ${c.req.param(
          "id"
        )} associated with user : ${userId}`,
      });
    const body: {
      title?: string;
      body?: string;
    } = await c.req.json();

    if (!body.body && !body.title)
      return c.json(
        { error: `Body or Title is required to update` },
        StatusCode.NOTFOUND
      );
    const res = await prisma.posts.update({
      where: {
        id: Number(postId),
        userId: userId,
      },
      data: {
        title: body.title,
        body: body.title,
      },
    });
    return c.json({
      message: `Post updated`,
      updatedPost: res,
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: `Internal server error : ${err}` }, 500);
  }
};
