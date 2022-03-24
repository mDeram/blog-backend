import Article from "./Article";
import { ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export default class Like extends BaseEntity {
    @PrimaryColumn()
    ip: string;

    @PrimaryColumn()
    articleId: number;

    @ManyToOne(() => Article, article => article.likes)
    article: Article;
}
