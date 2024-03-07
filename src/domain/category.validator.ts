import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Category } from './category.entity';
import { ClassPropertiesValidator } from '../shared/domain/validators/class-properties-validator';

export class CategoryRules {
  @IsString()
  @IsOptional()
  description!: string | null;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name!: string;

  constructor({ description, isActive, name }: Category) {
    Object.assign(this, { description, isActive, name });
  }
}

export class CategoryValidator extends ClassPropertiesValidator<CategoryRules> {
  validate(entity: Category) {
    return super.validate(new CategoryRules(entity));
  };
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}