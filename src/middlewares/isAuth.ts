import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";

const isAuth: MiddlewareFn<MyContext> = ({ context: { req } }, next) => {
    if (!req.session.userId) {
        throw new Error("Not authenticated");
    }
    return next();
}

export default isAuth;
