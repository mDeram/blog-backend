import Article from "../entities/Article";
import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { marked } from "marked";
import { customSlugify } from "../utils/customSlugify";

//TODO @UseMiddleware(isAuth)
//TODO add error messages
//TODO filed validation

@Resolver(Article)
export default class ArticleResolver {
    @FieldResolver(() => String)
    contentShort(
        @Root() root: Article
    ) {
        const text = root.content.replace(/<[^>]+>/g, "");
        return text.slice(0, 280);
    }

    @Query(() => Article, { nullable: true })
    async article(
        @Arg("id", () => Int) id: number
    ): Promise<Article | undefined> {
        return Article.findOne(id);
    }

    @Query(() => Article, { nullable: true })
    async articleBySlug(
        @Arg("slug") slug: string
    ): Promise<Article | undefined> {
        return Article.findOne({ slug });
    }

    @Query(() => [Article])
    async articles(): Promise<Article[]> {
        return Article.find();
    }

    @Mutation(() => Article, { nullable: true })
    async createArticle(
        @Arg("author") author: string,
        @Arg("title") title: string,
        @Arg("markdown") markdown: string,
    ): Promise<Article | null> {
        try {
            return await Article.create({
                author,
                title,
                content: marked.parse(markdown),
                markdown,
                published: false,
                slug: customSlugify(title),
            }).save();
        } catch(e) {
            return null;
        }
    }

    @Mutation(() => Boolean)
    async updateArticle(
        @Arg("id", () => Int) id: number,
        @Arg("author") author: string,
        @Arg("title") title: string,
        @Arg("markdown") markdown: string,
    ): Promise<boolean> {
        const result = await Article.update(id, {
            author,
            title,
            content: marked.parse(markdown),
            markdown,
            slug: customSlugify(title)
        });
        return !!result.affected;
    }

    @Mutation(() => Boolean)
    async deleteArticle(
        @Arg("id", () => Int) id: number
    ): Promise<boolean> {
        const result = await Article.delete(id);
        return !!result.affected;
    }

    @Mutation(() => Boolean)
    async setPublishArticle(
        @Arg("id", () => Int) id: number,
        @Arg("published") published: boolean
    ): Promise<boolean> {
        const result = await Article.update(id, { published });
        return !!result.affected;
    }
}
