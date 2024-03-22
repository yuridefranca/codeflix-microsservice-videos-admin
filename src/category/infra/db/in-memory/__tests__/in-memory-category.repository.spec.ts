import { Category } from '../../../../domain/category.entity';
import { InMemoryCategoryRepository } from '../in-memory-category.repository';

describe('In Memory Category Repository', () => {
  describe('getEntity', () => {
    it('should return the Category class', () => {
      const repository = new InMemoryCategoryRepository();
      const entity = repository.getEntity();

      expect(entity).toBe(Category);
    });
  });

  describe('filter', () => {
    const entities: any[] = Category
      .fake()
      .create(10)
      .withName((i: number) => `Category ${i}`)
      .build() as Category[];

    it.each([
      {
        data: {
          filter: null as any
        },
        expected: {
          length: 10,
          result: entities
        }
      },
      {
        data: {
          filter: 'category 1'
        },
        expected: {
          length: 1,
          result: [entities[1]]
        }
      },
    ])('should return the items that match the filter', async ({ data, expected }) => {
      // Arrange
      const repository = new InMemoryCategoryRepository();
      const entitiesFilterSpy = jest.spyOn(entities, 'filter' as any);

      // Act
      const result = await repository['filter'](entities, data.filter);

      // Assert
      if (!data.filter) {
        expect(entitiesFilterSpy).not.toHaveBeenCalled();
      } else {
        expect(entitiesFilterSpy).toHaveBeenCalled();
      }

      expect(result).toHaveLength(expected.length);
      expect(result).toEqual(expected.result);
    });
  });

  describe('sort', () => {
    const entities: any[] = Category
      .fake()
      .create(10)
      .withCreatedAt((i: number) => new Date(new Date('2024-01-01').getTime() + 100 * i))
      .withName((i: number) => `Category ${i}`)
      .build() as Category[];

    it.each([
      {
        data: {
          sortBy: 'name',
          sortDirection: 'asc' as any
        },
        expected: {
          result: [...entities].sort((a, b) => a.name.localeCompare(b.name))
        }
      },
      {
        data: {
          sortBy: null as any,
          sortDirection: null as any
        },
        expected: {
          result: [...entities].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }
      },
    ])('should return the items sorted', async ({ data, expected }) => {
      // Arrange
      const repository = new InMemoryCategoryRepository();

      // Act
      const result = repository['sort'](entities, data.sortBy, data.sortDirection);

      // Assert
      expect(result).toEqual(expected.result);
    });
  });
});