import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1719000000000 implements MigrationInterface {
    name = 'InitialSchema1719000000000'

    public async up(_queryRunner: QueryRunner): Promise<void> {
        // Add your migration logic here
        // Example: await _queryRunner.query(`CREATE TABLE ...`);
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        // Add rollback logic here
        // Example: await _queryRunner.query(`DROP TABLE ...`);
    }
}
