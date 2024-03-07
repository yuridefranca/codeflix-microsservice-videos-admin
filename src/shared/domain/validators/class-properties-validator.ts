import { validateSync } from 'class-validator';
import { ClassPropertiesValidationErrors, IClassPropertiesValidator } from './class-properties-validator.interface';

export abstract class ClassPropertiesValidator<ClassPropertiesRules> implements IClassPropertiesValidator<ClassPropertiesRules> {
  data: ClassPropertiesRules | null = null;
  errors: ClassPropertiesValidationErrors | null = null;

  validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints!);
      }
    } else {
      this.data = data;
    }

    return !errors.length;
  }
}