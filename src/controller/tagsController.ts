import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

enum StatusCode {
  BADREQ = 400,
  NOTFOUND = 404,
  NOTPERMISSIOON = 403,
}

export const getTags = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const res = prisma.tags.findMany({});
    return c.json({ tags: res });
  } catch (err) {
    console.error(`err`);
    return c.json({ error: `Internal Server Error` }, 500);
  }
};

export const getPostByTag = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const res = prisma.tags.findMany({
      where: {
        tag: String(c.req.param("tag")),
      },
      select: {
        post: {
          select: {
            User: {
              select: {
                username: true,
              },
            },
            id: true,
            userId: true,
            title: true,
            body: true,
            createdAt: true,
          },
        },
      },
    });

    return c.json({ posts: res });
  } catch (err) {
    console.error(`err`);
    return c.json({ error: `Internal Server Error` }, 500);
  }
};
