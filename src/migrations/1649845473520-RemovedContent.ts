import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedContent1649845473520 implements MigrationInterface {
    name = 'RemovedContent1649845473520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ADD "content" text NOT NULL`);
    }

}
