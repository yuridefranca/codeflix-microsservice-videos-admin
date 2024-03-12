import { ValueObject } from '../value-object';

export type SortDirection = 'asc' | 'desc';

export type SearchParamsConstructorProps<Filter = string> = {
  filter?: Filter | null;
  page?: number;
  perPage?: number;
  sortBy?: string | null;
  sortDirection?: SortDirection | null;
};

export class SearchParams<Filter = string> extends ValueObject {
  protected _filter!: Filter | null;
  protected _page!: number;
  protected _perPage!: number;
  protected _sortBy!: string | null;
  protected _sortDirection!: SortDirection | null;

  constructor({ filter, page, perPage, sortBy, sortDirection }: SearchParamsConstructorProps<Filter> = {}) {
    super();

    this.filter = filter!;
    this.page = page!;
    this.perPage = perPage!;
    this.sortBy = sortBy!;
    this.sortDirection = sortDirection!;
  }

  get filter(): Filter {
    return this._filter!;
  }

  private set filter(value: Filter) {
    this._filter = value === null || value === undefined || (value as unknown) === ''
      ? null
      : (`${value}` as any);;
  }

  get page(): number {
    return this._page ?? 1;
  }

  private set page(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      this._page = 1;
      return;
    }

    this._page = value;
  }

  get perPage(): number {
    return this._perPage ?? 10;
  }

  private set perPage(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      this._perPage = 10;
      return;
    }

    this._perPage = value;
  }

  get sortBy(): string {
    return this._sortBy!;
  }

  private set sortBy(value: string) {
    this._sortBy = value === null || value === undefined || value === ''
      ? null
      : `${value}`;
  }

  get sortDirection(): SortDirection {
    return this._sortDirection!;
  }

  private set sortDirection(value: SortDirection) {
    const validSortDirections = ['asc', 'desc'];
    const sortDirection = typeof value === 'string' ? value?.toLowerCase() : null;
    this._sortDirection = validSortDirections.includes(sortDirection as SortDirection)
      ? sortDirection as SortDirection
      : 'asc';
  }
}