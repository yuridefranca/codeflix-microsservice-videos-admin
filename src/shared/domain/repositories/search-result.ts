import { Entity } from '../entity';
import { ValueObject } from '../value-object';

type SearchResultConstructorProps<SearchResultEntity> = {
  currentPage: number;
  items: SearchResultEntity[];
  total: number;
  perPage: number;
};

export class SearchResult<SearchResultEntity extends Entity = Entity> extends ValueObject {
  public readonly currentPage!: number;
  public readonly items!: SearchResultEntity[];
  public readonly lastPage!: number;
  public readonly total!: number;
  public readonly perPage!: number;

  constructor({ currentPage, items, total, perPage }: SearchResultConstructorProps<SearchResultEntity>) {
    super();
    this.currentPage = currentPage;
    this.items = items;
    this.lastPage = Math.ceil(total / perPage);
    this.total = total;
    this.perPage = perPage;
  }

  toJson(applyToJsonOnEntity = false) {
    return {
      currentPage: this.currentPage,
      items: applyToJsonOnEntity ? this.items.map((item) => item.toJson()) : this.items,
      lastPage: this.lastPage,
      total: this.total,
      perPage: this.perPage,
    };
  }

}