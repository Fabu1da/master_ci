import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1719000000000 implements MigrationInterface {
    name = 'InitialSchema1719000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add your migration logic here
        // Example: await queryRunner.query(`CREATE TABLE ...`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add rollback logic here
        // Example: await queryRunner.query(`DROP TABLE ...`);
    }
}
