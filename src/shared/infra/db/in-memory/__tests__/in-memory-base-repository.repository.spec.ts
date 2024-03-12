import { forEach } from 'lodash';
import { Entity } from '../../../../domain';
import { NotFoundError } from '../../../../domain/errors';
import { Uuid } from '../../../../domain/value-objects';
import { InMemoryBaseRepository, InMemorySearchableBaseRepository } from '../in-memory-base-repository.repository';
import { SearchParams } from '../../../../domain/repositories/search-params';
import { SearchResult } from '../../../../domain/repositories/search-result';

class StubEntity extends Entity {
  constructor(public readonly entityId: Uuid, public property?: string) {
    super();
  }

  toJson() {
    return {
      entityId: this.entityId.toString(),
      property: this.property,
    };
  }
}

describe('In Memory Base Repository', () => {
  class StubInMemoryBaseRepository extends InMemoryBaseRepository<StubEntity, Uuid> {
    getEntity(): new (...args: any[]) => StubEntity {
      return StubEntity;
    }
  }

  describe('delete', () => {
    it('should throw an error if the entity does not exist', async () => {
      const repository = new StubInMemoryBaseRepository();
      const entityId = new Uuid();

      await expect(repository.delete(entityId)).rejects.toThrow(new NotFoundError(entityId, StubEntity));
    });

    it('should delete the entity', async () => {
      const repository = new StubInMemoryBaseRepository();
      const entityId = new Uuid();

      repository['items'].push(new StubEntity(entityId));
      await repository.delete(entityId);

      const entity = await repository.getById(entityId);

      expect(entity).toBeNull();
      expect(repository['items']).toHaveLength(0);
    });
  });

  describe('getById', () => {
    it('should return null if the entity does not exist', async () => {
      const repository = new StubInMemoryBaseRepository();
      const entityId = new Uuid();

      const entity = await repository.getById(entityId);

      expect(entity).toBeNull();
    });

    it('should return the entity', async () => {
      const repository = new StubInMemoryBaseRepository();
      const entityId = new Uuid();

      repository['items'].push(new StubEntity(entityId));
      const entity = await repository.getById(entityId);

      expect(entity).not.toBeNull();
      expect(entity).toBeInstanceOf(StubEntity);
    });
  });

  describe('list', () => {
    it('should return an empty array if there are no entities', async () => {
      const repository = new StubInMemoryBaseRepository();
      const entities = await repository.list();

      expect(entities).toHaveLength(0);
    });

    it('should return the entities', async () => {
      const repository = new StubInMemoryBaseRepository();

      const entityId = new Uuid();
      repository['items'].push(new StubEntity(entityId));

      const entityId2 = new Uuid();
      repository['items'].push(new StubEntity(entityId2));

      const entities = await repository.list();

      expect(entities).toHaveLength(2);
      expect(entities[0]).toBeInstanceOf(StubEntity);
    });
  });

  describe('save', () => {
    it('should save the entity', async () => {
      const repository = new StubInMemoryBaseRepository();
      const entityId = new Uuid();

      await repository.save(new StubEntity(entityId));

      const entity = await repository.getById(entityId);

      expect(entity).not.toBeNull();
      expect(entity).toBeInstanceOf(StubEntity);
    });
  });

  describe('saveBatch', () => {
    it('should save the entities', async () => {
      const repository = new StubInMemoryBaseRepository();
      const entityId = new Uuid();
      const entityId2 = new Uuid();

      await repository.saveBatch([new StubEntity(entityId), new StubEntity(entityId2)]);

      const entities = await repository.list();

      expect(entities).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should throw an error if the entity does not exist', async () => {
      const repository = new StubInMemoryBaseRepository();
      const entityId = new Uuid();

      await expect(repository.update(new StubEntity(entityId))).rejects.toThrow(new NotFoundError(entityId, StubEntity));
    });

    it('should update the entity', async () => {
      const repository = new StubInMemoryBaseRepository();
      const entityId = new Uuid();

      repository['items'].push(new StubEntity(entityId, 'old property'));
      await repository.update(new StubEntity(entityId, 'new property'));

      const entity = await repository.getById(entityId);

      expect(entity).not.toBeNull();
      expect(entity).toBeInstanceOf(StubEntity);
      expect(entity?.property).toBe('new property');
    });
  });
});

describe('In Memory Searchable Base Repository', () => {
  class StubInMemorySearchableBaseRepository extends InMemorySearchableBaseRepository<StubEntity, Uuid> {
    sortableFields: string[] = ['property'];

    getEntity(): new (...args: any[]) => StubEntity {
      return StubEntity;
    }

    protected async filter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
      if (!filter) {
        return items;
      }

      return items.filter((item) => item.property?.toLowerCase() === filter.toLowerCase());
    }
  }

  describe('filter', () => {
    const items = [new StubEntity(new Uuid(), 'value'), new StubEntity(new Uuid(), 'value'), new StubEntity(new Uuid(), 'different_value')];

    it.each([
      {
        data: {
          filter: null,
        }
      },
      {
        data: {
          filter: '',
        }
      },
      {
        data: {
          filter: undefined,
        }
      },
    ])('should return all items if the filter is empty', async ({ data }) => {
      // Arrange
      const repository = new StubInMemorySearchableBaseRepository();
      const itemsFilterSpy = jest.spyOn(items, 'filter' as any);

      // Act
      const result = await repository['filter'](items, data.filter as any);

      // Assert
      expect(itemsFilterSpy).not.toHaveBeenCalled();
      expect(result).toEqual(items);
    });

    it.each([
      {
        data: {
          filter: 'value'
        },
        expected: {
          length: 2,
          property: 'value'
        }
      },
      {
        data: {
          filter: 'different_value'
        },
        expected: {
          length: 1,
          property: 'different_value'
        }
      },
    ])('should return the items that match the filter', async ({ data, expected }) => {
      // Arrange
      const repository = new StubInMemorySearchableBaseRepository();
      const itemsFilterSpy = jest.spyOn(items, 'filter' as any);

      // Act
      const result = await repository['filter'](items, data.filter);

      // Assert
      expect(itemsFilterSpy).toHaveBeenCalled();
      expect(result).toHaveLength(expected.length);
      forEach(result, (item) => {
        expect(item.property).toBe(expected.property);
      });
    });
  });

  describe('paginate', () => {
    const items = [new StubEntity(new Uuid()), new StubEntity(new Uuid()), new StubEntity(new Uuid()), new StubEntity(new Uuid())];

    it.each([
      {
        data: {
          page: 1,
          perPage: 2
        },
        expected: {
          length: 2,
          result: [items[0], items[1]],
        },
      },
      {
        data: {
          page: 2,
          perPage: 2
        },
        expected: {
          length: 2,
          result: [items[2], items[3]],
        },
      },
      {
        data: {
          page: 4,
          perPage: 1
        },
        expected: {
          length: 1,
          result: [items[3]],
        },
      },
      {
        data: {
          page: 1,
          perPage: 4
        },
        expected: {
          length: 4,
          result: items,
        },
      }
    ])('should paginate the items', async ({ data, expected }) => {
      // Arrange
      const repository = new StubInMemorySearchableBaseRepository();

      // Act
      const result = repository['paginate'](items, data.page, data.perPage);

      // Assert
      expect(result).toHaveLength(expected.length);
      expect(result).toEqual(expected.result);
    });
  });

  describe('sort', () => {
    const items = [new StubEntity(new Uuid(), 'c'), new StubEntity(new Uuid(), 'b'), new StubEntity(new Uuid(), 'a')];

    it.each([
      {
        data: {
          sortBy: 'property',
          sortDirection: 'asc',
        },
        expected: {
          result: ['a', 'b', 'c'],
        },
      },
      {
        data: {
          sortBy: 'property',
          sortDirection: 'desc',
        },
        expected: {
          result: ['c', 'b', 'a'],
        },
      },
    ])('should sort the items', async ({ data, expected }) => {
      // Arrange
      const repository = new StubInMemorySearchableBaseRepository();

      // Act
      const result = repository['sort'](items, data.sortBy, data.sortDirection as any);

      // Assert
      forEach(result, (item, index) => {
        expect(item.property).toBe(expected.result[index]);
      });
    });
  });

  describe('search', () => {
    const entities: any[] = [];
    for (let index = 0; index < 10; index++) {
      const entityId = new Uuid();
      const entity = new StubEntity(entityId, `property ${index}`);
      entities.push(entity);
    }

    it('should return an empty array if there are no entities', async () => {
      // Arrange
      const repository = new StubInMemorySearchableBaseRepository();

      // Act
      const result = await repository.search(new SearchParams());

      // Assert
      expect(result.items).toHaveLength(0);
    });

    it.each([
      {
        data: new SearchParams(),
        expected: new SearchResult({
          currentPage: 1,
          items: entities.slice(0, 10),
          perPage: 10,
          total: 10,
        })
      },
      {
        data: new SearchParams({ page: 1, perPage: 5 }),
        expected: new SearchResult({
          currentPage: 1,
          items: entities.slice(0, 5),
          perPage: 5,
          total: 10,
        })
      },
      {
        data: new SearchParams({ page: 3, perPage: 5 }),
        expected: new SearchResult({
          currentPage: 3,
          items: entities.slice(10, 15),
          perPage: 5,
          total: 10,
        })
      },
    ])('should return the entities with custom pagination params', async ({ data, expected }) => {
      // Arrange
      const repository = new StubInMemorySearchableBaseRepository();
      repository['items'] = entities;

      // Act
      const result = await repository.search(data);

      // Assert
      expect(result).toStrictEqual(expected);
    });

    it.each([
      {
        data: new SearchParams({ sortBy: 'property', sortDirection: 'asc' }),
        expected: [...entities].sort((a, b) => a.property.localeCompare(b.property)),
      },
      {
        data: new SearchParams({ sortBy: 'property', sortDirection: 'desc' }),
        expected: [...entities].sort((a, b) => b.property.localeCompare(a.property)),
      }
    ])('should return the entities sorted', async ({ data, expected }) => {
      // Arrange
      const repository = new StubInMemorySearchableBaseRepository();
      repository['items'] = entities;

      // Act
      const result = await repository.search(data);

      // Assert
      expect(result).toStrictEqual(new SearchResult({
        currentPage: 1,
        items: expected.slice(0, 10),
        perPage: 10,
        total: 10,
      }));
    });

    it('should return the entities filtered by property', async () => { 
      // Arrange
      const repository = new StubInMemorySearchableBaseRepository();
      repository['items'] = entities;

      // Act
      const result = await repository.search(new SearchParams({ filter: 'property 1' }));

      // Assert
      expect(result).toStrictEqual(new SearchResult({
        currentPage: 1,
        items: [entities[1]],
        perPage: 10,
        total: 1,
      }));
    });
  });
});