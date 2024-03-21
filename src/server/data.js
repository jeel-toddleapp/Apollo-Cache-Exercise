const books = [
  {
    id: '1',
    name: "Harry Potter and the Philosopher's Stone",
    authorId: '1',
    tagId: '1',
    __typename: 'Book',
  },
  {
    id: '2',
    name: 'Jurassic Park',
    authorId: '2',
    tagId: '2',
    __typename: 'Book',
  },
  {
    id: '3',
    name: 'Harry Potter and the Chamber of Secrets',
    authorId: '3',
    tagId: '1',
    __typename: 'Book',
  },
];

const additionalDetailsByBook = {
  1: [
    {
      id: '1',
      year: '1997',
      pricePerUnit: '10.00',
      totalSell: '500,000',
    },
    {
      id: '2',
      year: '1998',
      pricePerUnit: '40.00',
      totalSell: '100,000',
    },
  ],
  2: [
    {
      id: '1',
      year: '1999',
      pricePerUnit: '10.00',
      totalSell: '200,000',
    },
    {
      id: '2',
      year: '2000',
      pricePerUnit: '10.00',
      totalSell: '700,000',
    },
  ],
  3: [
    {
      id: '1',
      year: '2001',
      pricePerUnit: '20.00',
      totalSell: '300,000',
    },
    {
      id: '2',
      year: '2002',
      pricePerUnit: '30.00',
      totalSell: '40,000',
    },
  ],
  4: [
    {
      id: '1',
      year: '1997',
      pricePerUnit: '80.00',
      totalSell: '500',
    },
    {
      id: '2',
      year: '1998',
      pricePerUnit: '90.00',
      totalSell: '50',
    },
  ],
  // 5: [
  //   {
  //     id: '1',
  //     year: '1997',
  //     pricePerUnit: '10.00',
  //     totalSell: '500,000,000',
  //   },
  //   {
  //     id: '2',
  //     year: '1998',
  //     pricePerUnit: '10.00',
  //     totalSell: '500,000,000',
  //   },
  // ],
  // 6: [
  //   {
  //     id: '1',
  //     year: '1997',
  //     pricePerUnit: '10.00',
  //     totalSell: '500,000,000',
  //   },
  //   {
  //     id: '2',
  //     year: '1998',
  //     pricePerUnit: '10.00',
  //     totalSell: '500,000,000',
  //   },
  // ],
};

export { books, additionalDetailsByBook };
