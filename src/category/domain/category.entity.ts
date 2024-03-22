import { Entity, ValueObject } from '../../shared/domain';
import { EntityValidationError } from '../../shared/domain/validators/class-properties-validator.error';
import { Uuid } from '../../shared/domain/value-objects';
import { CategoryFakerBuilder } from './category-faker-builder';
import { CategoryValidatorFactory } from './category.validator';

type CategoryConstructorProps = {
  categoryId?: Uuid;
  createdAt?: Date;
  description?: string;
  isActive?: boolean;
  name: string;
};

type CategoryCreateProps = Pick<CategoryConstructorProps, 'description' | 'isActive' | 'name'>;

export class Category extends Entity {
  public readonly categoryId!: Uuid;
  public readonly createdAt!: Date;
  public description!: string | null;
  public isActive!: boolean;
  public name!: string;

  constructor({ name, categoryId, createdAt, description, isActive }: CategoryConstructorProps) {
    super();
    Object.assign(this, {
      categoryId: categoryId ?? new Uuid(),
      createdAt: createdAt ?? new Date(),
      description: description ?? null,
      isActive: isActive ?? true,
      name,
    });
  }

  get entityId(): ValueObject {
    return this.categoryId;
  }

  static create(props: CategoryCreateProps) {
    const category = new Category(props);
    Category.validate(category);
    return category;
  }

  static validate(entity: Category) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(entity);
    if (!isValid) {
      throw new EntityValidationError(validator.errors!);
    }
  }

  static fake() {
    return CategoryFakerBuilder;
  }

  activate(): void {
    this.isActive = true;
  }

  changeName(name: string): void {
    this.name = name;
    Category.validate(this);
  }

  changeDescription(description: string): void {
    this.description = description;
    Category.validate(this);
  }

  deactivate(): void {
    this.isActive = false;
  }

  toJson() {
    return {
      categoryId: this.categoryId.value,
      createdAt: this.createdAt,
      description: this.description,
      isActive: this.isActive,
      name: this.name,
    };
  }
}