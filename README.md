# Coopersystem Naming Strategy for TypeORM

This package provide a custom naming strategies. The generated names are based on the column names.

If you have a model like this:

```ts
class Cat {
  @ManyToOne(
    () => BreedType,
    breedType => breedType.cats
  )
  @JoinColumn({ name: 'breed_type_id' })
  breedType: BreedType;
}
```

and

```ts
class BreedType {
  @OneToMany(
    () => Cat,
    cat => cat.breedType
  )
  cats?: Cat[];
}
```

The migration generate of this relation will be:

- Primary Key

```sql
  CONSTRAINT "PK_cat" PRIMARY KEY ("id"))
```

- Foreign Key

```sql
  CONSTRAINT "FK_breed_type_cat" FOREIGN KEY ("breed_type_id") REFERENCES "breed_type"("id")
```

## Examples

| Contraint         | Table         | Column(s)                     | Result                        |
|-------------------|---------------|-------------------------------|-------------------------------|
| Primary Key       | user          | id                            | PK_user                       |
| Foreign Key       | user -> photo | photo_id (user) -> id (photo) | FK_user_photo                 |
| Unique Constraint | user          | email, social_security        | UK_user_email_social_security |
| Index             | user          | first_name, last_name         | IDX_user_first_name_last_name |
| Default           | user          | active                        | DF_user_active                |

## Installation

> :warning: **Attention**: Under the hood we are using the package [typeorm-naming-strategies](https://github.com/tonivj5/typeorm-naming-strategies#readme) extending the strategy `SnakeNamingStrategy`.

```sh
yarn add @coopersystem-fsd/typeorm-naming-strategy
```

or with `npm`

```sh
npm i @coopersystem-fsd/typeorm-naming-strategy
```

## Usage

In your database configuration file, add the option `namingStrategy` informing the `CustomNamingStrategy` class. And, That's all.

> :warning: **Attention**: For use `namingStrategy` option, it is necessary to implement the connection settings in a separate file so that it is possible to pass it as a parameter in the execution of TypeORM commands by cli.

```ts
import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

import { CustomNamingStrategy } from '@coopersystem-fsd/custom-naming-strategy';

const env = dotenv.parse('../../');
dotenv.config(env);

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new CustomNamingStrategy(),
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

module.exports = config;
```

## To Do

- [ ] Generate check constraint names
