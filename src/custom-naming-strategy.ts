import { NamingStrategyInterface, Table } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

function parseName(
  prefix: string,
  tableOrName: Table | string,
  suffix?: string | string[]
) {
  const tableName =
    tableOrName instanceof Table ? tableOrName.name : tableOrName;

  suffix = Array.isArray(suffix) ? suffix.join('_') : suffix;

  return `${prefix}_${tableName}${suffix ? `_${suffix}` : ''}`.substr(0, 30);
}

export class CustomNamingStrategy extends SnakeNamingStrategy
  implements NamingStrategyInterface {
  constructor() {
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
    return parseName('FK', tableOrName, referencedTablePath);
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[]
  ): string {
    return parseName('UK', tableOrName, columnNames);
  }

  indexName(tableOrName: Table | string, columns: string[]): string {
    return parseName('IDX', tableOrName, columns);
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
