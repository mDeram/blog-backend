import { Query, Resolver } from "type-graphql";
import Category from "../entities/Category";

@Resolver(Category)
export default class CategoryResolver {
    @Query(() => [Category])
    async categories(): Promise<Category[]> {
        return Category.find();
    }
}
