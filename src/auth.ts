import "dotenv/config";
import typeormConfig from "./typeorm.config";
import { createConnection, getConnection } from "typeorm";
import { program } from "commander";
import User from "./entities/User";
import prompts from "prompts";
import argon2d from "argon2";
import speakeasy from "speakeasy";
import qrcode from "qrcode-terminal";
import { ___prod___ } from "./constants";

program
    .name("auth-manager")
    .description("CLI to manage auth user for the blog");

program
    .command("ls")
    .description("list all auth user")
    .action(async () => {
        const users = await User.find();
        exit(users);
    });

program
    .command("add <username>")
    .description("add a user")
    .action(async (username: string) => {
        const user = await User.findOne({ username });
        if (user) {
            exit(`User ${username} already exists`);
            return;
        }

        const { password } = await prompts({
            type: "password",
            name: "password",
            message: "Create a password"
        });
        const { confirmPassword } = await prompts({
            type: "password",
            name: "confirmPassword",
            message: "Confirm your password"
        });
        if (password !== confirmPassword) {
            exit("Passwords differ, could not create user");
            return;
        }

        const hash = await argon2d.hash(password);

        const { base32: secret } = speakeasy.generateSecret();
        const test = ___prod___ ? "" : "test:";
        const otpauth_uri = `otpauth://totp/Blog:${test}${username}?secret=${secret}`;

        const newUser = User.create({
            username,
            password: hash,
            authToken: secret
        });

        try {
            await newUser.save();
        } catch(e) {
            console.log(e);
            exit("Could not save the new user to the database");
            return;
        }

        qrcode.generate(otpauth_uri);
        console.log("Qrcode secret: ", secret);
        console.log("Make sure you save the secret or the qrcode");
        exit(`User ${username} has been successfully saved to the database`);
    });

program
    .command("rm <username>")
    .description("remove a user")
    .action(async (username: string) => {
        let result;
        try {
            result = await User.delete({ username })
        } catch(e) {
            console.log(e);
            exit("Could not remove the user from the database");
            return;
        }

        if (!result.affected) {
            exit(`User ${username} does not exists`);
            return;
        }

        exit(`User ${username} has been successfully removed`);
    });

program
    .command("flush")
    .description("remove all user")
    .action(async () => {
        try {
            await User.clear();
        } catch(e) {
            console.log(e);
            exit("Could not remove users from the database");
            return;
        }

        exit(`Users have been successfully removed`);
    });

const main = async () => {
    await createConnection({
        ...typeormConfig,
        synchronize: false,
        logging: false
    });

    program.parse();
}

const exit = async (message?: any) => {
    if (message) console.log(message);
    await getConnection().close();
}

main();
