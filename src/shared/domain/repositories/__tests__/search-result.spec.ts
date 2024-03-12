import { SearchResult } from '../search-result';

describe('Search Result', () => {
  describe('constructor', () => {
    it.each([
      {
        data: {
          currentPage: 1,
          items: ['entity 1'] as any,
          total: 2,
          perPage: 10
        },
        expected: {
          currentPage: 1,
          items: ['entity 1'],
          lastPage: 1,
          total: 2,
          perPage: 10
        }
      },
      {
        data: {
          currentPage: 1,
          items: ['entity 1', 'entity 2', 'entity 3'] as any,
          total: 3,
          perPage: 1
        },
        expected: {
          currentPage: 1,
          items: ['entity 1', 'entity 2', 'entity 3'],
          lastPage: 3,
          total: 3,
          perPage: 1
        }
      },
      {
        data: {
          currentPage: 1,
          items: ['entity 1', 'entity 2', 'entity 3', 'entity 4', 'entity 5'] as any,
          total: 5,
          perPage: 2
        },
        expected: {
          currentPage: 1,
          items: ['entity 1', 'entity 2', 'entity 3', 'entity 4', 'entity 5'],
          lastPage: 3,
          total: 5,
          perPage: 2
        }
      },
    ])('should create a new instance of SearchParams and set the properties properly', ({ data, expected }) => {
      // Act
      const result = new SearchResult(data);

      // Assert
      expect(result).toMatchObject(expected);
    });
  });
});