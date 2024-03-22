import { CategoryFakerBuilder } from '../category-faker-builder';
import { Category } from '../category.entity';

describe('CategoryFakerBuilder', () => {
  it('should create 1 category with random data', () => {
    const category = CategoryFakerBuilder.create().build() as Category;

    expect(category).toBeInstanceOf(Category);
    expect(category.categoryId).toBeDefined();
    expect(category.createdAt).toBeDefined();
    expect(category.description).toBeDefined();
    expect(category.isActive).toBeDefined();
    expect(category.name).toBeDefined();
  });

  it('should create n categories with random data', () => {
    let quantity = Math.floor(Math.random() * 15);
    quantity = quantity <= 1 ? 2 : quantity;
    const categories = CategoryFakerBuilder.create(quantity).build() as Category[];

    expect(categories).toHaveLength(quantity);
    categories.forEach((category) => {
      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBeDefined();
      expect(category.createdAt).toBeDefined();
      expect(category.description).toBeDefined();
      expect(category.isActive).toBeDefined();
      expect(category.name).toBeDefined();
    });
  });

  describe('withCategoryId', () => {
    it.todo('should create a category with a custom category id');

    it.todo('should create n categories with a custom category id');
  });

  describe('withCreatedAt', () => {
    it('should create a category with a custom createdAt', () => {
      const createdAt = new Date('2024-01-01');
      const category = CategoryFakerBuilder.create().withCreatedAt(createdAt).build() as Category;

      expect(category.createdAt).toEqual(createdAt);
    });

    it('should create n categories with a custom createdAt', () => {
      const createdAt = new Date('2024-01-01');
      let quantity = Math.floor(Math.random() * 15);
      quantity = quantity <= 1 ? 2 : quantity;
      const categories = CategoryFakerBuilder.create(quantity).withCreatedAt(createdAt).build() as Category[];

      expect(categories).toHaveLength(quantity);
      categories.forEach((category) => {
        expect(category.createdAt).toEqual(createdAt);
      });
    });

    it('should create n categories with a custom createdAt function', () => {
      const baseDate = new Date('2024-01-01');
      const createdAt = (i: number) => new Date(baseDate.getTime() + 100 * i);
      let quantity = Math.floor(Math.random() * 3) + 1;
      quantity = quantity <= 1 ? 2 : quantity;
      const categories = CategoryFakerBuilder.create(quantity).withCreatedAt(createdAt).build() as Category[];

      expect(categories).toHaveLength(quantity);
      categories.forEach((category, index) => {
        expect(category.createdAt).toEqual(createdAt(index));
      });

    });
  });

  describe('withDescription', () => {
    it('should create a category with a custom description', () => {
      const description = 'any_description';
      const category = CategoryFakerBuilder.create().withDescription(description).build() as Category;

      expect(category.description).toBe(description);
    });

    it('should create n categories with a custom description', () => {
      const description = 'any_description';
      let quantity = Math.floor(Math.random() * 15);
      quantity = quantity <= 1 ? 2 : quantity;
      const categories = CategoryFakerBuilder.create(quantity).withDescription(description).build() as Category[];

      expect(categories).toHaveLength(quantity);
      categories.forEach((category) => {
        expect(category.description).toBe(description);
      });
    });
  });

  describe('withIsActive', () => {
    it('should create a category with a custom isActive', () => {
      const isActive = false;
      const category = CategoryFakerBuilder.create().withIsActive(isActive).build() as Category;

      expect(category.isActive).toBe(isActive);
    });

    it('should create n categories with a custom isActive', () => {
      const isActive = false;
      let quantity = Math.floor(Math.random() * 15);
      quantity = quantity <= 1 ? 2 : quantity;
      const categories = CategoryFakerBuilder.create(quantity).withIsActive(isActive).build() as Category[];

      expect(categories).toHaveLength(quantity);
      categories.forEach((category) => {
        expect(category.isActive).toBe(isActive);
      });
    });
  });

  describe('withName', () => {
    it('should create a category with a custom name', () => {
      const name = 'any_name';
      const category = CategoryFakerBuilder.create().withName(name).build() as Category;

      expect(category.name).toBe(name);
    });

    it('should create n categories with a custom name', () => {
      const name = 'any_name';
      let quantity = Math.floor(Math.random() * 15);
      quantity = quantity <= 1 ? 2 : quantity;
      const categories = CategoryFakerBuilder.create(quantity).withName(name).build() as Category[];

      expect(categories).toHaveLength(quantity);
      categories.forEach((category) => {
        expect(category.name).toBe(name);
      });
    });

    it('should create n categories with a custom name function', () => {
      const name = (i: number) => `name_${i}`;
      let quantity = Math.floor(Math.random() * 15);
      quantity = quantity <= 1 ? 2 : quantity;
      const categories = CategoryFakerBuilder.create(quantity).withName(name).build() as Category[];

      expect(categories).toHaveLength(quantity);
      categories.forEach((category, index) => {
        expect(category.name).toBe(name(index));
      });
    });
  });
});