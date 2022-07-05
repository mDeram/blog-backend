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

if (!process.env.COOKIE_SECRET) throw new Error("You need to set COOKIE_SECRET environment variable");
if (!process.env.FRONT_URL) throw new Error("You need to set FRONT_URL environment variable");

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
        secret: process.env.COOKIE_SECRET!,
        resave: false,
        saveUninitialized: false,
    }));

    const apolloServer = new ApolloServer(await apolloConfig);
    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        cors: {
            origin: process.env.FRONT_URL,
            credentials: true
        }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port: ${port}, with front-url: ${process.env.FRONT_URL}`);
    });
}

main();
