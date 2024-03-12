import { randomUUID } from 'crypto';

import { ValueObject } from '../value-object';

export class Uuid extends ValueObject {
  readonly value: string;

  constructor(value?: string) {
    super();
    this.value = value ?? this.generate();
    this.validate();
  }

  private generate(): string {
    return randomUUID();
  }

  private validate(): void {
    const uuidRegex = /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-4[0-9a-fA-F]{3}\-(8|9|a|b)[0-9a-fA-F]{3}\-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(this.value)) {
      throw new InvalidUuidError();
    }
  }

  toString(): string {
    return this.value;
  }
}

export class InvalidUuidError extends Error {
  constructor() {
    super('Invalid UUID');
    this.name = 'InvalidUuidError';
  }
}