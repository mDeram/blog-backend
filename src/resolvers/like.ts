import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import Article from "../entities/Article";
import Like from "../entities/Like";

@Resolver(Like)
export default class LikeResolver {
    @Query(() => Boolean)
    async like(
        @Arg("articleId", () => Int) articleId: number,
        @Ctx() { req }: MyContext
    ) {
        const { ip } = req;
        const like = await Like.findOne({ articleId, ip });
        return !!like;
    }

    @Mutation(() => Boolean)
    async toggleLike(
        @Arg("articleId", () => Int) articleId: number,
        @Ctx() { req }: MyContext
    ) {
        const { ip } = req;

        const article = await Article.findOne(articleId);
        if (!article) return false;

        const like = await Like.findOne({ articleId, ip });
        if (like) {
            const result = await Like.delete({ articleId, ip });
            if (!result.affected) return false;

            article.likeCounter -= 1;
            await Article.save(article);

            return true;
        }

        await Like.create({ articleId, ip }).save();
        article.likeCounter += 1;
        await Article.save(article);

        return true;
    }
}
