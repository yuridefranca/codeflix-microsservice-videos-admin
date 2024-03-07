export type ClassPropertiesValidationErrors = {
  [field: string]: string[];
};

export interface IClassPropertiesValidator<ClassPropertiesRules> {
  data: ClassPropertiesRules | null;
  errors: ClassPropertiesValidationErrors | null;
  validate(data: any): boolean;
}
