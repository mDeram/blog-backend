import Category from "./Category";
import Like from "./Like";
import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export default class Article extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    author!: string;

    @Field()
    @Column({ type: "boolean", default: false })
    published: boolean;

    @Field()
    @Column({ type: "text", unique: true })
    title: string;

    @Field()
    @Column({ unique: true })
    slug: string;

    @Field()
    @Column("text")
    markdown: string;

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
    likeCounter: number;

    @OneToMany(() => Like, like => like.article)
    likes: Like[];

    @Field(() => [Category])
    @ManyToMany(() => Category, category => category.articles)
    @JoinTable()
    categories: Category[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
