import { SortDirection } from '../../../../shared/domain/repositories/search-params';
import { Uuid } from '../../../../shared/domain/value-objects';
import { InMemorySearchableBaseRepository } from '../../../../shared/infra/db/in-memory';
import { Category } from '../../../domain/category.entity';

export class InMemoryCategoryRepository extends InMemorySearchableBaseRepository<Category, Uuid> {
  sortableFields: string[] = ['createdAt', 'name'];

  protected async filter(items: Category[], filter: string): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => item.name?.toLowerCase().includes(filter.toLowerCase()));
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  protected sort(items: Category[], sortBy: string, sortDirection: SortDirection): Category[] {
    return sortBy ? super.sort(items, sortBy, sortDirection) : super.sort(items, 'name', 'desc');
  }
}