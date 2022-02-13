import Article from "../entities/Article";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export default class ArticleResolver {
    @Query(() => Article, { nullable: true })
    async article(
        @Arg("id") id: number
    ): Promise<Article | undefined> {
        return Article.findOne(id);
    }
}
