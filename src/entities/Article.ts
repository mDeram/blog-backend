import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export default class Article extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    author: string;

    @Field()
    @Column({ type: "boolean", default: false })
    published: boolean;

    @Field()
    @Column("text")
    title: string;

    @Field()
    @Column("text")
    content: string;

    @Field()
    @Column("text")
    markdown: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
