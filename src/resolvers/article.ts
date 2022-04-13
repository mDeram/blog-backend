import Article from "../entities/Article";
import { Arg, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { customSlugify } from "../utils/customSlugify";
import isAuth from "../middlewares/isAuth";
import { ISRArticleById, ISRBlog } from "../middlewares/ISR";
import Like from "../entities/Like";
import { getManager } from "typeorm";

//TODO add error messages
//TODO filed validation

@Resolver(Article)
export default class ArticleResolver {
    @Query(() => Article, { nullable: true })
    @UseMiddleware(isAuth)
    async article(
        @Arg("id", () => Int) id: number
    ): Promise<Article | undefined> {
        return Article.findOne(id);
    }

    @Query(() => Article, { nullable: true })
    async articleBySlug(
        @Arg("slug") slug: string
    ): Promise<Article | undefined> {
        return Article.findOne({ slug, published: true });
    }

    @Query(() => [Article])
    async articlesPublished(): Promise<Article[]> {
        return Article.find({
            where: {
                published: true
            },
            order: {
                createdAt: "DESC"
            }
        });
    }

    @Query(() => [Article])
    @UseMiddleware(isAuth)
    async articles(): Promise<Article[]> {
        return Article.find({
            order: {
                createdAt: "DESC"
            }
        });
    }

    @Mutation(() => Article, { nullable: true })
    @UseMiddleware(isAuth)
    async createArticle(
        @Arg("author") author: string,
        @Arg("title") title: string,
        @Arg("markdown") markdown: string,
        @Arg("description") description: string,
    ): Promise<Article | null> {
        try {
            return await Article.create({
                author,
                title,
                markdown,
                description,
                published: false,
                slug: customSlugify(title),
            }).save();
        } catch(e) {
            return null;
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth, ISRBlog, ISRArticleById)
    async updateArticle(
        @Arg("id", () => Int) id: number,
        @Arg("author") author: string,
        @Arg("title") title: string,
        @Arg("markdown") markdown: string,
        @Arg("description") description: string,
    ): Promise<boolean> {
        const result = await Article.update(id, {
            author,
            title,
            markdown,
            description,
            slug: customSlugify(title)
        });
        return !!result.affected;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth, ISRBlog, ISRArticleById)
    async deleteArticle(
        @Arg("id", () => Int) id: number
    ): Promise<boolean> {
        const result = await getManager().transaction(async transaction => {
            await transaction.delete(Like, { articleId: id });
            return await transaction.delete(Article, id);
        });
        return !!result.affected;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth, ISRBlog, ISRArticleById)
    async setPublishArticle(
        @Arg("id", () => Int) id: number,
        @Arg("published") published: boolean
    ): Promise<boolean> {
        const result = await Article.update(id, { published });
        return !!result.affected;
    }
}
