import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const operation = { a: 1, b: 2, action: Action.Add };
    expect(simpleCalculator(operation)).toBe(3);
  });

  test('should subtract two numbers', () => {
    const operation = { a: 1, b: 2, action: Action.Subtract };
    expect(simpleCalculator(operation)).toBe(-1);
  });

  test('should multiply two numbers', () => {
    const operation = { a: 3, b: 2, action: Action.Multiply };
    expect(simpleCalculator(operation)).toBe(6);
  });

  test('should divide two numbers', () => {
    const operation = { a: 4, b: 2, action: Action.Divide };
    expect(simpleCalculator(operation)).toBe(2);
  });

  test('should exponentiate two numbers', () => {
    const operation = { a: 4, b: 4, action: Action.Exponentiate };
    expect(simpleCalculator(operation)).toBe(256);
  });

  test('should return null for invalid action', () => {
    const operation = { a: 2, b: 1, action: 'Invalid action' };
    expect(simpleCalculator(operation)).toBe(null);
  });

  test('should return null for invalid arguments', () => {
    const operation = { a: 'Invalid', b: 'Argument', action: Action.Add };
    expect(simpleCalculator(operation)).toBe(null);
  });
});
