import { Config } from "apollo-server-express";
import { ___prod___ } from "./constants";
import { buildSchema } from "type-graphql";
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";

import ArticleResolver from "./resolvers/article";

export default (async (): Promise<Config> => {
    return {
        schema: await buildSchema({
            resolvers: [ArticleResolver],
        }),
        plugins: [
            ___prod___
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageGraphQLPlayground()
        ]
    };
})();
