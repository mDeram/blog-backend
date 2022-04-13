import {MigrationInterface, QueryRunner} from "typeorm";

export class Description1649847097567 implements MigrationInterface {
    name = 'Description1649847097567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ADD "description" text NOT NULL DEFAULT 'default'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "description"`);
    }

}
