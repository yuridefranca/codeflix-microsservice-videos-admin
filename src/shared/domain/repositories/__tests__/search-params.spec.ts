import { SearchParams } from '../search-params';

describe('Search Params', () => {
  describe('filter property', () => {
    it.each([
      { data: { filter: null }, expected: null },
      { data: { filter: undefined }, expected: null },
      { data: { filter: '' }, expected: null },
      { data: { filter: 0 }, expected: '0' },
      { data: { filter: -1 }, expected: '-1' },
      { data: { filter: 5.5 }, expected: '5.5' },
      { data: { filter: true }, expected: 'true' },
      { data: { filter: false }, expected: 'false' },
      { data: { filter: {} }, expected: '[object Object]' },
      { data: { filter: 'field' }, expected: 'field' },
    ])('should set the filter property properly', ({ data, expected }) => {
      const params = new SearchParams();
      expect(params.filter).toBeNull();

      expect(new SearchParams(data).filter).toBe(expected);
    });
  });

  describe('page property', () => {
    const DEFAULT_PAGE = 1;

    it.each([
      { data: { page: null }, expected: DEFAULT_PAGE },
      { data: { page: undefined }, expected: DEFAULT_PAGE },
      { data: { page: '' }, expected: DEFAULT_PAGE },
      { data: { page: 'fake' }, expected: DEFAULT_PAGE },
      { data: { page: 0 }, expected: DEFAULT_PAGE },
      { data: { page: -1 }, expected: DEFAULT_PAGE },
      { data: { page: 5.5 }, expected: DEFAULT_PAGE },
      { data: { page: true }, expected: DEFAULT_PAGE },
      { data: { page: false }, expected: DEFAULT_PAGE },
      { data: { page: {} }, expected: DEFAULT_PAGE },
      { data: { page: 1 }, expected: DEFAULT_PAGE },
      { data: { page: 2 }, expected: 2 },
    ])('should set the page property properly', ({ data, expected }) => {
      const params = new SearchParams();
      expect(params.page).toBe(DEFAULT_PAGE);

      expect(new SearchParams(data as any).page).toBe(expected);
    });
  });

  describe('perPage property', () => {
    const DEFAULT_PER_PAGE = 10;

    it.each([
      { data: { perPage: null }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: undefined }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: '' }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: 'fake' }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: 0 }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: -1 }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: 5.5 }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: true }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: false }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: {} }, expected: DEFAULT_PER_PAGE },
      { data: { perPage: 1 }, expected: 1 },
      { data: { perPage: 2 }, expected: 2 },
      { data: { perPage: 15 }, expected: 15 },
    ])('should set the perPage property properly', ({ data, expected }) => {
      const params = new SearchParams();
      expect(params.perPage).toBe(DEFAULT_PER_PAGE);

      expect(new SearchParams(data as any).perPage).toBe(expected);
    });
  });

  describe.each([
    { data: { sortBy: null }, expected: null },
    { data: { sortBy: undefined }, expected: null },
    { data: { sortBy: '' }, expected: null },
    { data: { sortBy: 0 }, expected: '0' },
    { data: { sortBy: -1 }, expected: '-1' },
    { data: { sortBy: 5.5 }, expected: '5.5' },
    { data: { sortBy: true }, expected: 'true' },
    { data: { sortBy: false }, expected: 'false' },
    { data: { sortBy: {} }, expected: '[object Object]' },
    { data: { sortBy: 'field' }, expected: 'field' },
  ])('sortBy property', ({ data, expected }) => {
    it(`should set the sort property properly`, () => {
      const params = new SearchParams();
      expect(params.sortBy).toBeNull();

      expect(new SearchParams(data as any).sortBy).toBe(expected);
    });
  });

  describe.each([
    { data: { sortDirection: null }, expected: 'asc' },
    { data: { sortDirection: undefined }, expected: 'asc' },
    { data: { sortDirection: '' }, expected: 'asc' },
    { data: { sortDirection: 0 }, expected: 'asc' },
    { data: { sortDirection: 'fake' }, expected: 'asc' },
    { data: { sortDirection: 'asc' }, expected: 'asc' },
    { data: { sortDirection: 'ASC' }, expected: 'asc' },
    { data: { sortDirection: 'desc' }, expected: 'desc' },
    { data: { sortDirection: 'DESC' }, expected: 'desc' },
  ])(('sortDirection property'), ({ data, expected }) => {
    it(`should set the sortDirection property properly`, () => {
      expect(new SearchParams(data as any).sortDirection).toBe(expected);
    });
  });
});