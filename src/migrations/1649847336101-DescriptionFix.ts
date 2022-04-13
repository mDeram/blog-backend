import {MigrationInterface, QueryRunner} from "typeorm";

export class DescriptionFix1649847336101 implements MigrationInterface {
    name = 'DescriptionFix1649847336101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "description" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "description" SET DEFAULT 'default'`);
    }

}
