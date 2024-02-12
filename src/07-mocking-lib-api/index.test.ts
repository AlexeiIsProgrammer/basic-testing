import axios from 'axios';
import lodash from 'lodash';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';
  const relativePath = '/users';
  const res = {
    data: [
      { id: 1, name: 'Liza' },
      { id: 2, name: 'Vitaly' },
      { id: 3, name: 'Alex' },
    ],
  };

  beforeEach(() => {
    jest.spyOn(axios, 'create').mockReturnThis();
    jest.spyOn(axios, 'get').mockResolvedValue(res);
    jest.spyOn(lodash, 'throttle').mockImplementation((fn) => fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const create = jest.spyOn(axios, 'create');

    await throttledGetDataFromApi(relativePath);

    jest.runAllTimers();

    expect(create).toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const get = jest.spyOn(axios, 'get');

    await throttledGetDataFromApi(relativePath);

    jest.runAllTimers();

    expect(get).toHaveBeenCalled();
    expect(get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const data = await throttledGetDataFromApi(relativePath);

    jest.runAllTimers();

    expect(data).toEqual(res.data);
  });
});
