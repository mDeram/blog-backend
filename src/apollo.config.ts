import { Config } from "apollo-server-express";
import { ___prod___ } from "./constants";
import { buildSchema } from "type-graphql";
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";

import ArticleResolver from "./resolvers/article";
import CategoryResolver from "./resolvers/category";
import UserResolver from "./resolvers/user";
import { MyContext } from "./types";
import LikeResolver from "./resolvers/like";

export default (async (): Promise<Config> => {
    return {
        schema: await buildSchema({
            resolvers: [ArticleResolver, CategoryResolver, UserResolver, LikeResolver],
        }),
        plugins: [
            ___prod___
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageGraphQLPlayground()
        ],
        context: ({ req }): MyContext => ({ req })
    };
})();
