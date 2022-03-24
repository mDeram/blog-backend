import {MigrationInterface, QueryRunner} from "typeorm";

export class Like1648127821304 implements MigrationInterface {
    name = 'Like1648127821304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "like" ("ip" character varying NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_64eb21840185262b465eaca277d" PRIMARY KEY ("ip", "articleId"))`);
        await queryRunner.query(`ALTER TABLE "article" ADD "likeCounter" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_a95ce350aee91167d8a1cefeb97" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_a95ce350aee91167d8a1cefeb97"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "likeCounter"`);
        await queryRunner.query(`DROP TABLE "like"`);
    }

}
