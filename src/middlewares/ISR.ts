import { MyContext } from "../types";
import { MiddlewareFn, ResolverData } from "type-graphql";
import axios from "axios";
import Article from "../entities/Article";
import { basePath } from "../constants";

function triggerISR(path: string | undefined) {
    if (typeof path === "undefined") return;

    axios.get(process.env.REVALIDATE_URL || "", {
        params: {
            token: process.env.REVALIDATE_TOKEN,
            path: basePath + path
        }
    }).catch(console.error);
}

type ISRCb = (action: ResolverData<MyContext>, result: Promise<any>) => Promise<string | undefined> | string | undefined;

const ISR = (cb: ISRCb) => {
    const ISRMiddleware: MiddlewareFn<MyContext> = async (action, next) => {
        const result = await next();

        triggerISR(await cb(action, result));

        return result;
    }
    return ISRMiddleware;
}

export const ISRBlog = ISR(() => "");
export const ISRArticleById = ISR(async ({ args, root }, result) => {
    if (!result && !args.id) return;

    const article = await Article.findOne(args.id);
    if (!article) return;

    return "/article/" + article.slug;
});

export default ISR;
