import {
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('BankAccount', () => {
  jest.mock('./index.ts', () => ({
    fetchBalance: jest.fn(),
  }));

  test('should create account with initial balance', () => {
    const initialBalance = 777;
    const bankAccount = getBankAccount(initialBalance);
    expect(bankAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 777;
    const amount = 1000;
    const bankAccount = getBankAccount(initialBalance);
    const errorMessage = `Insufficient funds: cannot withdraw more than ${bankAccount.getBalance()}`;

    expect(() => bankAccount.withdraw(amount)).toThrow(InsufficientFundsError);
    expect(() => bankAccount.withdraw(amount)).toThrow(errorMessage);
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 777;
    const amount = 1000;
    const bankAccount = getBankAccount(initialBalance);
    const anotherBankAccount = getBankAccount(initialBalance);
    const errorMessage = `Insufficient funds: cannot withdraw more than ${bankAccount.getBalance()}`;

    expect(() => bankAccount.transfer(amount, anotherBankAccount)).toThrow(
      InsufficientFundsError,
    );
    expect(() => bankAccount.transfer(amount, anotherBankAccount)).toThrow(
      errorMessage,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 777;
    const amount = 1000;
    const bankAccount = getBankAccount(initialBalance);
    const anotherBankAccount = bankAccount;
    const errorMessage = 'Transfer failed';

    expect(() => bankAccount.transfer(amount, anotherBankAccount)).toThrow(
      TransferFailedError,
    );
    expect(() => bankAccount.transfer(amount, bankAccount)).toThrow(
      errorMessage,
    );
  });

  test('should deposit money', () => {
    const initialBalance = 777;
    const amount = 223;
    const bankAccount = getBankAccount(initialBalance);
    const expectedValue = amount + initialBalance;

    expect(bankAccount.deposit(amount).getBalance()).toBe(expectedValue);
  });

  test('should withdraw money', () => {
    const initialBalance = 777;
    const amount = 277;
    const bankAccount = getBankAccount(initialBalance);
    const expectedValue = initialBalance - amount;

    expect(bankAccount.withdraw(amount).getBalance()).toBe(expectedValue);
  });

  test('should transfer money', () => {
    const initialBalance = 777;
    const amount = 277;
    const bankAccount = getBankAccount(initialBalance);
    const anotherBankAccount = getBankAccount(initialBalance);

    const expectedValue = initialBalance - amount;
    const anotherExpectedValue = initialBalance + amount;

    expect(bankAccount.transfer(amount, anotherBankAccount).getBalance()).toBe(
      expectedValue,
    );
    expect(anotherBankAccount.getBalance()).toBe(anotherExpectedValue);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 500;
    const bankAccount = getBankAccount(initialBalance);

    const fetchedValue = 30;
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(fetchedValue);

    const fetchedBalance = await bankAccount.fetchBalance();

    expect(typeof fetchedBalance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 500;
    const bankAccount = getBankAccount(initialBalance);

    const fetchedValue = 30;
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(fetchedValue);

    await bankAccount.synchronizeBalance();

    expect(bankAccount.getBalance()).toBe(fetchedValue);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 500;
    const bankAccount = getBankAccount(initialBalance);
    const errorMessage = 'Synchronization failed';

    const fetchedValue = null;
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(fetchedValue);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      errorMessage,
    );
  });
});
