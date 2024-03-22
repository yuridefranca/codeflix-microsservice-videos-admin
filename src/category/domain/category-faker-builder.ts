import { Chance } from 'chance';
import { Category } from './category.entity';
import { Uuid } from '../../shared/domain/value-objects';

type PropertyValue<T> = T | ((i: number) => T);

export class CategoryFakerBuilder {
  private _categoryId!: PropertyValue<Uuid>;
  private _createdAt!: PropertyValue<Date>;
  private _description!: PropertyValue<string | null>;
  private _isActive!:  PropertyValue<boolean>;
  private _name!: PropertyValue<string>;

  private readonly chance: Chance.Chance;

  private quantity: number;

  private constructor(quantity: number) {
    this.chance = Chance();
    this.quantity = quantity;
  }

  get categoryId(): PropertyValue<Uuid> {
    return this._categoryId;
  }

  get createdAt(): PropertyValue<Date> {
    return this._createdAt;
  }

  get description(): PropertyValue<string | null> {
    return this._description;
  }

  get isActive(): PropertyValue<boolean> {
    return this._isActive;
  }

  get name(): PropertyValue<string> {
    return this._name;
  }

  static create(quantity: number = 1): CategoryFakerBuilder {
    return new CategoryFakerBuilder(quantity);
  }

  build(): Category | Category[] {
    const categories = new Array(this.quantity).fill(undefined).map((value, index) => new Category({
      createdAt: this.getValue('_createdAt', index) ?? this.chance.date(),
      description: this.getValue('_description', index) ?? this.chance.sentence(),
      isActive: this.getValue('_isActive', index) ?? this.chance.bool(),
      name: this.getValue('_name', index) ?? this.chance.word(),
    }));

    return this.quantity > 1 ? categories : categories[0];
  }

  withCategoryId(categoryId: PropertyValue<Uuid>): CategoryFakerBuilder {
    this._categoryId = categoryId;
    return this;
  }

  withCreatedAt(createdAt: PropertyValue<Date>): CategoryFakerBuilder {
    this._createdAt = createdAt;
    return this;
  }

  withDescription(description: PropertyValue<string | null>): CategoryFakerBuilder {
    this._description = description;
    return this;
  }

  withIsActive(isActive: PropertyValue<boolean>): CategoryFakerBuilder {
    this._isActive = isActive;
    return this;
  }

  withName(name: PropertyValue<string>): CategoryFakerBuilder {
    this._name = name;
    return this;
  }

  private getValue(property: string, index: number): any {
    return (this as any)[property] instanceof Function ? (this as any)[property](index) : (this as any)[property];
  }
}

