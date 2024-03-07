import { InvalidUuidError, Uuid } from '../uuid.vo';

describe('UUID Value Object', () => {
  const generateSpy = jest.spyOn(Uuid.prototype as any, 'generate');
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

  it('should return an error if the uuid is invalid', () => {
    const uuid = 'invalid-uuid';
    expect(() => new Uuid(uuid)).toThrow(InvalidUuidError);
    expect(generateSpy).not.toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should return the uuid if the provided uuid is valid', () => {
    const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const uuidVo = new Uuid(uuid);
    expect(uuidVo.value).toBe(uuid);
    expect(generateSpy).not.toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a valid uuid if no value is provided', () => {
    const uuidVo = new Uuid();
    expect(uuidVo.value).toMatch(/^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-4[0-9a-fA-F]{3}\-(8|9|a|b)[0-9a-fA-F]{3}\-[0-9a-fA-F]{12}$/);
    expect(generateSpy).toHaveBeenCalledTimes(1);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});