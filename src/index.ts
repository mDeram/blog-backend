import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { FRONT_URL, PORT } from "./constants";
import { createConnection } from "typeorm";
import typeormConfig from "./typeorm.config";
import express from "express";
import apolloConfig from "./apollo.config";

const main = async () => {
    await createConnection(typeormConfig);

    const app = express();

    const apolloServer = new ApolloServer(await apolloConfig);
    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        cors: {
            origin: [FRONT_URL],
        }
    });

    app.listen(PORT, () => {

        console.log(`Server started on ${PORT}`);
    });
}

main();
