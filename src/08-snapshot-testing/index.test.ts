import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const tags = [2, 'Tag2', { a: 1, b: 2 }, 'Tag4'];
    const expectedLinkedTagList = {
      value: 2,
      next: {
        value: 'Tag2',
        next: {
          value: { a: 1, b: 2 },
          next: {
            value: 'Tag4',
            next: {
              value: null,
              next: null,
            },
          },
        },
      },
    };
    expect(generateLinkedList(tags)).toStrictEqual(expectedLinkedTagList);
  });

  test('should generate linked list from values 2', () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    expect(generateLinkedList(numbers)).toMatchSnapshot();
  });
});
