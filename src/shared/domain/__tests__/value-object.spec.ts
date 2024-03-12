import { ValueObject } from '../value-object';

class StringValueObject extends ValueObject {
  constructor(private value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(private value: string, private otherValue: number) {
    super();
  }
}

describe('Value Object', () => {
  const data = [
    {
      value: new StringValueObject('test'),
      otherValue: new StringValueObject('test'),
    },
    {
      value: new ComplexValueObject('test', 1),
      otherValue: new ComplexValueObject('test', 1),
    },
  ];
  it.each(data)('should return true if two value objects are equal', ({ otherValue, value }) => {
    expect(value.equals(otherValue)).toBeTruthy();
  });
});