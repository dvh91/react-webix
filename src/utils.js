import * as faker from "faker";

const generateData = (count = 100, columnCount = 20) => {
  return new Array(count).fill().map((_, i) => {
    return {
      name: faker.name.firstName(),
      phone: faker.phone.phoneNumber(),
      ...(i % 4 ? { count: faker.random.number({ min: 5, max: 10 }) } : {}),
      ...new Array(columnCount).fill().reduce((result, curr, index) => {
        result["random_" + index] = faker.name.firstName();
        return result;
      }, {})
    };
  });
};

export default generateData;
