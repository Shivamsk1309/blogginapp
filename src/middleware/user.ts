import { Next } from "hono";

import { Jwt } from "hono/utils/jwt";

export async function authmiddleware(c: any, next: Next) {
  try {
    const token: string = c.req.header("Authorization").split(" ")[1];
    if (token !== null || token !== undefined) {
      const decode = await Jwt.verify(token, c.env.JWT_SECRET as string);
      if (decode) {
        c.set("userId", decode);
        await next();
      }
      return c.body("you are unauthroized user sorry", 401);
    }
    return c.body("you are unauthroized user", 401);
  } catch (error) {
    return c.body("unauthroized ", 401);
  }
}
