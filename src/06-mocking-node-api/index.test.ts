import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  test('should set timeout with provided callback and timeout', () => {
    const TIMEOUT_VALUE = 1250;

    const cb = jest.fn();

    doStuffByTimeout(cb, TIMEOUT_VALUE);

    jest.advanceTimersByTime(TIMEOUT_VALUE);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(cb, TIMEOUT_VALUE);
  });

  test('should call callback only after timeout', () => {
    const TIMEOUT_VALUE = 2000;

    const cb = jest.fn();

    doStuffByTimeout(cb, TIMEOUT_VALUE);

    expect(cb).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(cb).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setInterval');
  });

  test('should set interval with provided callback and timeout', () => {
    const INTERVAL_VALUE = 1250;

    const cb = jest.fn();

    doStuffByInterval(cb, INTERVAL_VALUE);

    jest.advanceTimersByTime(INTERVAL_VALUE);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(cb, INTERVAL_VALUE);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const INTERVAL_VALUE = 1250;
    const TIMES = 2;

    const cb = jest.fn();

    doStuffByInterval(cb, INTERVAL_VALUE);

    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(INTERVAL_VALUE * TIMES);

    expect(cb).toHaveBeenCalledTimes(TIMES);
  });
});

describe('readFileAsynchronously', () => {
  const CONTENT = 'Hello world';
  beforeEach(() => {
    jest
      .spyOn(path, 'join')
      .mockImplementation((...args: string[]) => args.join('/'));

    jest.spyOn(fsPromises, 'readFile').mockResolvedValue(CONTENT);
  });

  test('should call join with pathToFile', async () => {
    const pathname = './file.md';
    const join = jest.spyOn(path, 'join');

    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await readFileAsynchronously(pathname);

    expect(join.mock.calls.at(0)).toContain(pathname);
  });

  test('should return null if file does not exist', async () => {
    const pathname = './file.md';

    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    expect(await readFileAsynchronously(pathname)).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathname = './file.md';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    const expectedContent = await readFileAsynchronously(pathname);
    expect(expectedContent).toBe(CONTENT);
  });
});
