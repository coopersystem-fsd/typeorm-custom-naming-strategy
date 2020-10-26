import { Connection, createConnection } from 'typeorm';

import { CustomNamingStrategy } from '../../src/custom-naming-strategy';
import { Photo } from '../fixtures/entities/photo.entity';
import { User } from '../fixtures/entities/user.entity';

describe('Custom naming strategy', () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'typeorm_naming',
      entities: [User, Photo],
      namingStrategy: new CustomNamingStrategy(),
    });
  });
  afterAll(async () => await connection.close());

  it('can recognize model changes', async () => {
    const { upQueries } = await connection.driver.createSchemaBuilder().log();

    expect(upQueries[0].query).toBe(
      'CREATE TABLE "photo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "filename" character varying NOT NULL, "views" integer NOT NULL, "is_published" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_photo" PRIMARY KEY ("id"))'
    );
    expect(upQueries[1].query).toBe(
      'CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "age" integer NOT NULL, "photo_id" integer, CONSTRAINT "UK_user_email" UNIQUE ("email"), CONSTRAINT "CH_user_age" CHECK (age > 18), CONSTRAINT "PK_user" PRIMARY KEY ("id"))'
    );
    expect(upQueries[2].query).toBe(
      'CREATE INDEX "IDX_user_first_name" ON "user" ("first_name") '
    );
    expect(upQueries[3].query).toBe(
      'ALTER TABLE "user" ADD CONSTRAINT "FK_user_photo" FOREIGN KEY ("photo_id") REFERENCES "photo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  });
});
