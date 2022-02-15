import { ConnectionOptions } from "typeorm";
import { ___prod___ } from "./constants";
import path from "path";
import Article from "./entities/Article";
import Category from "./entities/Category";

export default {
    type: "postgres",
    database: "blog",
    username: "blog",
    password: process.env.DB_PASS,
    logging: !___prod___,
    synchronize: !___prod___,
    entities: [Article, Category],
    migrations: [path.join(__dirname, "./migrations/*")]
} as ConnectionOptions;
