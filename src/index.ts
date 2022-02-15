import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import typeormConfig from "./typeorm.config";
import express from "express";
import apolloConfig from "./apollo.config";

const main = async () => {
    await createConnection(typeormConfig);

    const app = express();

    const apolloServer = new ApolloServer(await apolloConfig);
    await apolloServer.start();

    const frontUrl = process.env.FRONT_URL || "";
    apolloServer.applyMiddleware({
        app,
        cors: {
            origin: [frontUrl],
        }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port: ${port}, with front-url: ${frontUrl}`);
    });
}

main();
