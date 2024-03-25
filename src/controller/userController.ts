import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { signInSchema, signUpSchema } from "../zod/user";
import { Jwt } from "hono/utils/jwt";

export enum StatusCode {
  BAD_REQ = 400,
  NOTFOUND = 404,
  NOTPERMISSION = 403,
}

export const signup = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body: {
      username: string;
      password: string;
      email: string;
    } = await c.req.json();
    const userInputValidation = signUpSchema.safeParse(body);
    if (!userInputValidation.success) {
      return c.json({ message: "Invald User Input " }, StatusCode.BAD_REQ);
    }
    const userExist = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (userExist) {
      return c.json(
        { message: "User Email alreay exists! " },
        StatusCode.BAD_REQ
      );
    }
    const newUser = await prisma.user.create({
      data: {
        username: body.email,
        password: body.password,
        email: body.email,
      },
    });
    const { id, username, email, password } = newUser;

    return c.json({
      message: "User Created Succesfully",
      user: {
        username,
        id,
        email,
        password,
      },
    });
  } catch (e) {
    console.error(e);

    return c.json({ message: `Internal Server Err : ${e}` }, 500);
  }
};

export const signIn = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const credentials: {
      email: string;
      password: string;
    } = await c.req.json();

    const inputValidation = signInSchema.safeParse(credentials);
    if (!inputValidation.success) {
      return c.json({ message: "Invalid User Inputs" }, StatusCode.BAD_REQ);
    }
    const userExist = await prisma.user.findFirst({
      where: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    if (!userExist) {
      return c.json(
        { message: "User does not exists, Please SignUp First" },
        StatusCode.BAD_REQ
      );
    }
    const { id, email, username } = userExist;

    const token = await Jwt.sign(id, c.env.JWT_SECRET);

    return c.json({
      message: "Login Successful",
      token: token,
      user: { id, email, username },
    });
  } catch (e) {
    console.error(e);
  }
};

export const getAllUsers = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const users = await prisma.user.findMany();
    return c.json({ message: "All Users", users });
  } catch (e) {
    console.error(e);
    return c.json({ message: `Internal Server Err : ${e}` }, 500);
  }
};
