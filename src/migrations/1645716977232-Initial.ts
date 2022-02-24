import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1645716977232 implements MigrationInterface {
    name = 'Initial1645716977232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "author" character varying NOT NULL, "published" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "slug" character varying NOT NULL, "markdown" text NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fca3cb9ba4963678f564f22e7a8" UNIQUE ("title"), CONSTRAINT "UQ_0ab85f4be07b22d79906671d72f" UNIQUE ("slug"), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "authToken" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_categories_category" ("articleId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_a8116c8896d1d576d6ea7ad0d3c" PRIMARY KEY ("articleId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4ba35bcb36b2715f61faa696c7" ON "article_categories_category" ("articleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5d9199768aa2bd9f91d175dc6d" ON "article_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "article_categories_category" ADD CONSTRAINT "FK_4ba35bcb36b2715f61faa696c7e" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_categories_category" ADD CONSTRAINT "FK_5d9199768aa2bd9f91d175dc6d1" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_categories_category" DROP CONSTRAINT "FK_5d9199768aa2bd9f91d175dc6d1"`);
        await queryRunner.query(`ALTER TABLE "article_categories_category" DROP CONSTRAINT "FK_4ba35bcb36b2715f61faa696c7e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d9199768aa2bd9f91d175dc6d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4ba35bcb36b2715f61faa696c7"`);
        await queryRunner.query(`DROP TABLE "article_categories_category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
