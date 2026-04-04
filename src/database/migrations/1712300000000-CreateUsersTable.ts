import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1712300000000 implements MigrationInterface {
  name = 'CreateUsersTable1712300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(120) NOT NULL UNIQUE,
        name VARCHAR(120) NOT NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS users');
  }
}
