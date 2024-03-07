import { ClassPropertiesValidationErrors } from './class-properties-validator.interface';

export class EntityValidationError extends Error {
  constructor(public readonly errors: ClassPropertiesValidationErrors, message = 'Validation Error') {
    super(message);
  }
}