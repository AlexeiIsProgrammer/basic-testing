import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const expectedValue = 'hello world';
    const resolvedValue = Promise.resolve(resolveValue(expectedValue));

    await expect(resolvedValue).resolves.toBe(expectedValue);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const expectedErrorMessage = "There's an error!";

    expect(() => throwError(expectedErrorMessage)).toThrow(Error);
    expect(() => throwError(expectedErrorMessage)).toThrow(
      expectedErrorMessage,
    );
  });

  test('should throw error with default message if message is not provided', () => {
    const expectedErrorMessage = 'Oops!';

    expect(() => throwError()).toThrow(Error);
    expect(() => throwError()).toThrow(expectedErrorMessage);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const expectedErrorMessage = 'This is my awesome custom error!';

    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(expectedErrorMessage);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });
});
