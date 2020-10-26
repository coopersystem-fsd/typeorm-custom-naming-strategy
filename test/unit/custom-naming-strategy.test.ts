import { CustomNamingStrategy } from '../../src/custom-naming-strategy';

describe('Custom naming strategy', () => {
  let strategy: CustomNamingStrategy;
  beforeAll(() => {
    strategy = new CustomNamingStrategy();
  });

  describe.each([
    ['cat', 'PK_cat'],
    ['breed_type', 'PK_breed_type'],
  ])('primaryKeyName with table name: %s', (tableName, expectedKey) => {
    it(`should return the primary key name ${expectedKey}`, () => {
      const key = strategy.primaryKeyName(tableName);

      expect(key).toBe(expectedKey);
    });
  });

  describe.each([['breed_type', 'cat', 'FK_breed_type_cat']])(
    'foreignKeyName with table name: %s',
    (tableName, referencedTablePath, expectedKey) => {
      it(`should return the foreign key name ${expectedKey}`, () => {
        const key = strategy.foreignKeyName(tableName, [], referencedTablePath);

        expect(key).toBe(expectedKey);
      });
    }
  );

  describe.each([
    ['cat', ['name', 'owner_id'], 'UK_cat_name_owner_id'],
    ['breed_type', ['name'], 'UK_breed_type_name'],
    ['documento', ['rg', 'orgao_emissor'], 'UK_documento_rg_orgao_emissor'],
  ])(
    'uniqueConstraintName with table name: %s and columns: %j',
    (tableName, columns, expectedKey) => {
      it(`should return the unique contraint name ${expectedKey}`, () => {
        const key = strategy.uniqueConstraintName(tableName, columns);

        expect(key).toBe(expectedKey);
      });
    }
  );

  describe.each([
    ['phone', ['number', 'area_code'], 'IDX_phone_number_area_code'],
    ['cat', ['name'], 'IDX_cat_name'],
  ])(
    'indexName with table name: %s and columns: %s',
    (tableName, expression, expectedKey) => {
      it(`should return the index name ${expectedKey}`, () => {
        const key = strategy.indexName(tableName, expression);

        expect(key).toBe(expectedKey);
      });
    }
  );

  describe.each([
    ['cat', 'lives', 'DF_cat_lives'],
    ['breed_type', 'name', 'DF_breed_type_name'],
  ])(
    'defaultConstraintName with table name: %s and column: %s',
    (tableName, column, expectedKey) => {
      it(`should return the default constraint name ${expectedKey}`, () => {
        const key = strategy.defaultConstraintName(tableName, column);

        expect(key).toBe(expectedKey);
      });
    }
  );
});