import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import typeormConfig from "./typeorm.config";
import express from "express";
import apolloConfig from "./apollo.config";
import session from "express-session";
import { SESSION_COOKIE, ___prod___ } from "./constants";
import connectRedis from "connect-redis";
import Redis from "ioredis";

const main = async () => {
    const orm = await createConnection(typeormConfig);
    if (___prod___) await orm.runMigrations();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    const app = express();
    if (___prod___) app.set("trust proxy", 1);
    app.use(session({
        store: new RedisStore({
            client: redis,
            prefix: "blog:sess:"
        }),
        name: SESSION_COOKIE,
        cookie: {
            maxAge: 1000 * 3600 * 24 * 10, // 10 days
            secure: ___prod___,
            sameSite: "lax",
            httpOnly: true
        },
        secret: process.env.COOKIE_SECRET || "",
        resave: false,
        saveUninitialized: false,
    }));

    const apolloServer = new ApolloServer(await apolloConfig);
    await apolloServer.start();

    const frontUrl = process.env.FRONT_URL || "";
    apolloServer.applyMiddleware({
        app,
        cors: {
            origin: ["http://localhost:6000", frontUrl],
            credentials: true
        }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port: ${port}, with front-url: ${frontUrl}`);
    });
}

main();
