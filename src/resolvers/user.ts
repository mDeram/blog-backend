import User from "../entities/User";
import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";
import { MyContext } from "../types";

@Resolver(User)
export default class UserResolver {
    @Mutation(() => Boolean)
    async login(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Arg("authToken", () => Int) authToken: number,
        @Ctx() { req }: MyContext
    ) {
        // Waiting >= 0.5s and < 1s to protect against bruteforce attack
        // Also makes it harder to know if a username as been found
        const waitTime = (Math.random() / 2 + 0.5) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        const date = new Date();
        console.log(`Login attempt to ${username} on ${date.toDateString()} at ${date.toTimeString()}`);

        const user = await User.findOne({ username });
        if (!user) return false;

        const valid = await argon2.verify(user.password, password);
        if (!valid) return false;

        //TODO add 2fa

        req.session.userId = user.id;
        return true;
    }
}
