import { Entity } from '../entity';
import { ValueObject } from '../value-object';

export class NotFoundError extends Error {
  constructor(readonly entityIds: ValueObject | ValueObject[], readonly entityClass: new (...args: any[]) => Entity) {
    super(`${entityClass.name} not found with ${Array.isArray(entityIds) ? entityIds.join(', ') : entityIds}`);
    this.name = 'NotFoundError';
  }
}