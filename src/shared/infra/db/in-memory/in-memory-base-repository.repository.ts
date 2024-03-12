import { Entity, ValueObject } from '../../../domain';
import { NotFoundError } from '../../../domain/errors';
import { Repository, SearchableRepository } from '../../../domain/repositories/repository.interface';
import { SearchParams } from '../../../domain/repositories/search-params';
import { SearchResult } from '../../../domain/repositories/search-result';

export abstract class InMemoryBaseRepository<RepositoryEntity extends Entity, RepositoryEntityId extends ValueObject> implements Repository<RepositoryEntity, RepositoryEntityId> {
  protected items: RepositoryEntity[] = [];

  async delete(entityId: RepositoryEntityId): Promise<void> {
    const entity = await this.getById(entityId);
    if (entity === null) {
      throw new NotFoundError(entityId, this.getEntity());
    }

    this.items = this.items.filter((entity) => !entity.entityId.equals(entityId));
  }

  async getById(entityId: RepositoryEntityId): Promise<RepositoryEntity | null> {
    return this.items.find((entity) => entity.entityId.equals(entityId)) ?? null;
  }

  abstract getEntity(): new (...args: any[]) => RepositoryEntity;

  async list(): Promise<RepositoryEntity[]> {
    return this.items;
  }

  async save(entity: RepositoryEntity): Promise<void> {
    this.items.push(entity);
  }

  async saveBatch(items: RepositoryEntity[]): Promise<void> {
    this.items = [...this.items, ...items];
  }

  async update(entity: RepositoryEntity): Promise<void> {
    const foundEntityIndex = this.items.findIndex((entity) => entity.entityId.equals(entity.entityId));
    if (foundEntityIndex === -1) {
      throw new NotFoundError(entity.entityId, this.getEntity());
    }

    this.items[foundEntityIndex] = entity;
  }
}

export abstract class InMemorySearchableBaseRepository<
  SearchableRepositoryEntity extends Entity,
  SearchableRepositoryEntityId extends ValueObject,
  Filter = string
>
  extends InMemoryBaseRepository<SearchableRepositoryEntity, SearchableRepositoryEntityId>
  implements SearchableRepository<SearchableRepositoryEntity, SearchableRepositoryEntityId, Filter> {
  sortableFields: string[] = [];

  async search({ filter, page, perPage, sortBy, sortDirection }: SearchParams<Filter>): Promise<SearchResult<Entity>> {
    const itemsFiltered = await this.filter(this.items, filter);
    const itemsSorted = this.sort(itemsFiltered, sortBy, sortDirection);
    const itemsPaginated = this.paginate(itemsSorted, page, perPage);

    const result = new SearchResult({
      currentPage: page,
      items: itemsPaginated,
      perPage,
      total: itemsFiltered.length,
    });

    return result;
  }

  protected abstract filter(items: SearchableRepositoryEntity[], filter: Filter): Promise<SearchableRepositoryEntity[]>;

  protected paginate(items: SearchableRepositoryEntity[], page: SearchParams['page'], perPage: SearchParams['perPage']) {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return items.slice(start, end);
  };

  protected sort(items: SearchableRepositoryEntity[], sortBy: SearchParams['sortBy'], sortDirection: SearchParams['sortDirection'], customGetter?: (sort: string, item: SearchableRepositoryEntity) => any) {
    if (!sortBy || !this.sortableFields.includes(sortBy)) {
      return items;
    }

    return [...items].sort((a, b) => {
      const aValue = customGetter ? customGetter(sortBy, a) : (a as any)[sortBy];
      const bValue = customGetter ? customGetter(sortBy, b) : (b as any)[sortBy];
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }
}