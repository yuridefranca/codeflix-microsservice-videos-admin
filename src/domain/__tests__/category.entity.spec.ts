import { EntityValidationError } from '../../shared/domain/validators/class-properties-validator.error';
import { Uuid } from '../../shared/domain/value-objects';
import { Category } from '../category.entity';

describe('Category Entity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.useFakeTimers()
      .setSystemTime(new Date('2024-01-01'));
  });

  describe('constructor', () => {
    it('should instantiate a category entity with a custom name and default values', () => {
      const category = new Category({ name: 'any_category_name' });

      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.createdAt).toEqual(new Date('2024-01-01'));
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(true);
      expect(category.name).toBe('any_category_name');
    });

    it('should instantiate a category entity with a custom name, category id and default values', () => {
      const categoryId = new Uuid();
      const category = new Category({ categoryId, name: 'any_category_name' });

      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBe(categoryId);
      expect(category.createdAt).toEqual(new Date('2024-01-01'));
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(true);
      expect(category.name).toBe('any_category_name');
    });

    it('should instantiate a category entity with a custom name, createdAt and default values', () => {
      const createdAt = new Date('2023-01-01');
      const category = new Category({ createdAt, name: 'any_category_name' });

      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.createdAt).toEqual(createdAt);
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(true);
      expect(category.name).toBe('any_category_name');
    });

    it('should instantiate a category entity with a custom name, description and default values', () => {
      const category = new Category({ description: 'any_description', name: 'any_category_name' });

      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.createdAt).toEqual(new Date('2024-01-01'));
      expect(category.description).toBe('any_description');
      expect(category.isActive).toBe(true);
      expect(category.name).toBe('any_category_name');

    });

    it('should instantiate a category entity with a custom name, isActive and default values', () => {
      const category = new Category({ isActive: false, name: 'any_category_name' });

      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.createdAt).toEqual(new Date('2024-01-01'));
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(false);
      expect(category.name).toBe('any_category_name');
    });
  });

  describe('create', () => {
    const validatorSpy = jest.spyOn(Category, 'validate');

    it.each([
      {
        data: { name: '' },
        error: new EntityValidationError({})
      },
      {
        data: { name: null },
        error: new EntityValidationError({})
      },
      {
        data: { name: undefined },
        error: new EntityValidationError({})
      },
      {
        data: { name: 'a'.repeat(256) },
        error: new EntityValidationError({})
      },
    ])('should throw an error if the name property is invalid', ({ data, error }) => {
      expect(() => Category.create(data as any)).toThrow(error);
      expect(validatorSpy).toHaveBeenCalledTimes(1);
    });

    it.each([
      {
        data: { name: 'any_valid_name', description: 1 },
        error: new EntityValidationError({})
      },
    ])('should throw an error if the description property is invalid', ({ data, error }) => {
      expect(() => Category.create(data as any)).toThrow(error);
      expect(validatorSpy).toHaveBeenCalledTimes(1);
    });

    it.each([
      {
        data: { name: 'any_valid_name', isActive: '' },
        error: new EntityValidationError({})
      },
      {
        data: { name: 'any_valid_name', isActive: 'invalid_boolean' },
        error: new EntityValidationError({})
      },
    ])('should throw an error if the isActive property is invalid', ({ data, error }) => {
      expect(() => Category.create(data as any)).toThrow(error);
      expect(validatorSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a category entity with a custom name and default values', () => {
      const category = Category.create({ name: 'any_category_name' });

      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.createdAt).toEqual(new Date('2024-01-01'));
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(true);
      expect(category.name).toBe('any_category_name');
      expect(validatorSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a category entity with a custom name, description and default values', () => {
      const category = Category.create({ description: 'any_description', name: 'any_category_name' });

      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.createdAt).toEqual(new Date('2024-01-01'));
      expect(category.description).toBe('any_description');
      expect(category.isActive).toBe(true);
      expect(category.name).toBe('any_category_name');
      expect(validatorSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a category entity with a custom name, isActive and default values', () => {
      const category = Category.create({ isActive: false, name: 'any_category_name' });

      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.createdAt).toEqual(new Date('2024-01-01'));
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(false);
      expect(category.name).toBe('any_category_name');
      expect(validatorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('activate', () => {
    it('should activate a category', () => {
      const category = Category.create({ isActive: false, name: 'any_category_name', });

      category.activate();
      expect(category.isActive).toBe(true);
    });
  });

  describe('changeName', () => {
    const validatorSpy = jest.spyOn(Category, 'validate');

    it.each([
      {
        data: '',
        error: new EntityValidationError({})
      },
      {
        data: null,
        error: new EntityValidationError({})
      },
      {
        data: undefined,
        error: new EntityValidationError({})
      },
      {
        data: 'a'.repeat(256),
        error: new EntityValidationError({})
      }
    ])('should throw an error if the name property is invalid', ({ data, error }) => { 
      const category = Category.create({ name: 'any_category_name' });

      expect(() => category.changeName(data!)).toThrow(error);
      expect(validatorSpy).toHaveBeenCalledTimes(2);
    });

    it('should change the category name', () => {
      const category = Category.create({ name: 'any_category_name' });

      category.changeName('new_category_name');

      expect(category.name).toBe('new_category_name');
      expect(validatorSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('changeDescription', () => {
    const validatorSpy = jest.spyOn(Category, 'validate');

    it.each([
      {
        data: 1,
        error: new EntityValidationError({})
      },
    ])('should throw an error if the description property is invalid', ({ data, error }) => {
      const category = Category.create({ name: 'any_category_name' });

      expect(() => category.changeDescription(data as any)).toThrow(error);
      expect(validatorSpy).toHaveBeenCalledTimes(2);
    });

    it('should change the category description', () => {
      const category = Category.create({ name: 'any_category_name' });

      category.changeDescription('new_description');

      expect(category.description).toBe('new_description');
      expect(validatorSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a category', () => {
      const category = Category.create({ isActive: false, name: 'any_category_name' });

      category.deactivate();

      expect(category.isActive).toBe(false);
    });
  });

  describe('toJson', () => {
    it('should return the category data in JSON format', () => {
      const category = Category.create({ name: 'any_category_name' });

      expect(category.toJson()).toEqual({
        categoryId: expect.any(String),
        createdAt: new Date('2024-01-01'),
        description: null,
        isActive: true,
        name: 'any_category_name',
      });
    });
  });

  describe('categoryId property', () => {
    it.todo('should throw an error if the category id is invalid');

    it.each([
      { categoryId: undefined },
      { categoryId: null },
      { categoryId: new Uuid() }
    ])('should fill with or accept a valid uuid', ({ categoryId }) => {
      const category = new Category({ categoryId: categoryId as any, name: 'any_category_name' });
      expect(category.categoryId).toBeInstanceOf(Uuid);

      if (categoryId) {
        expect(category.categoryId).toBe(categoryId);
      }
    });
  });
});
