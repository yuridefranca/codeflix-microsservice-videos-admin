import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export interface Repository<RepositoryEntity extends Entity, RepositoryEntityId extends ValueObject> {
  delete(entityId: RepositoryEntityId): Promise<void>;
  getById(entityId: RepositoryEntityId): Promise<RepositoryEntity | null>;
  getEntity(): new (...args: any[]) => RepositoryEntity;
  list(): Promise<RepositoryEntity[]>;
  save(entity: RepositoryEntity): Promise<void>;
  saveBatch(entity: RepositoryEntity[]): Promise<void>;
  update(entity: RepositoryEntity): Promise<void>;
}

export interface SearchableRepository<
  RepositoryEntity extends Entity,
  RepositoryEntityId extends ValueObject,
  Filter = string,
  RepositorySearchParams = SearchParams<Filter>,
  RepositorySearchResult = SearchResult
>
  extends Repository<RepositoryEntity, RepositoryEntityId> {
  sortableFields: string[];

  search(request: RepositorySearchParams): Promise<RepositorySearchResult>;
}