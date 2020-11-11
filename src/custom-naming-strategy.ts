import { NamingStrategyInterface, Table } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

function parseName(
  prefix: string,
  tableOrName: Table | string,
  suffix?: string | string[],
  length = 30
) {
  const tableName =
    tableOrName instanceof Table ? tableOrName.name : tableOrName;

  suffix = Array.isArray(suffix) ? suffix.join('_') : suffix;

  return `${prefix}_${tableName}${suffix ? `_${suffix}` : ''}`.substr(
    0,
    length
  );
}

interface CustomNamingStrategyOptions {
  indexLength?: number;
  foreignKeyLength?: number;
}

export class CustomNamingStrategy extends SnakeNamingStrategy
  implements NamingStrategyInterface {
  constructor(private readonly _options?: CustomNamingStrategyOptions) {
    super();
  }

  primaryKeyName(tableOrName: Table | string): string {
    return parseName('PK', tableOrName);
  }

  foreignKeyName(
    tableOrName: Table | string,
    _: string[],
    referencedTablePath?: string
  ): string {
    return parseName(
      'FK',
      tableOrName,
      referencedTablePath,
      this._options?.foreignKeyLength
    );
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[]
  ): string {
    return parseName('UK', tableOrName, columnNames);
  }

  indexName(tableOrName: Table | string, columns: string[]): string {
    return parseName('IDX', tableOrName, columns, this._options?.indexLength);
  }

  defaultConstraintName(
    tableOrName: Table | string,
    columnName: string
  ): string {
    return parseName('DF', tableOrName, columnName);
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return alias + '_' + propertyPath.replace('.', '_');
  }
}
