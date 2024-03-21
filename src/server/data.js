const tags = [
  {
    id: '1',
    value: 'Fantasy',
    __typename: 'Tag',
  },
  {
    id: '2',
    value: 'Science Fiction',
    __typename: 'Tag',
  },
];

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
    authorId: '1',
    tagId: '1',
    __typename: 'Book',
  },
  {
    id: '4',
    name: 'Jurassic Park 2',
    authorId: '2',
    tagId: '2',
    __typename: 'Book',
  },
  {
    id: '5',
    name: 'Harry Potter and the Prisoner of Azkaban',
    authorId: '1',
    tagId: '1',
    __typename: 'Book',
  },
  {
    id: '6',
    name: 'Harry Potter and the Goblet of Fire',
    authorId: '1',
    tagId: '1',
    __typename: 'Book',
  },
  {
    id: '7',
    name: 'Harry Potter and the Order of the Phoenix',
    authorId: '1',
    tagId: '1',
    __typename: 'Book',
  },
  {
    id: '8',
    name: 'Harry Potter and the Half-Blood Prince',
    authorId: '1',
    tagId: '1',
    __typename: 'Book',
  },
  {
    id: '9',
    name: 'Harry Potter and the Deathly Hallows',
    authorId: '1',
    tagId: '1',
    __typename: 'Book',
  },
  {
    id: '10',
    name: "You don't know JS",
    authorId: '3',
    tagId: '2',
    __typename: 'Book',
  },
  {
    id: '11',
    name: 'AJAX for Dummies',
    authorId: '4',
    tagId: '2',
    __typename: 'Book',
  },
  {
    id: '12',
    name: 'Node.js for Dummies',
    authorId: '5',
    tagId: '2',
    __typename: 'Book',
  },
  {
    id: '13',
    name: 'React.js for Beginners',
    authorId: '6',
    tagId: '2',
    __typename: 'Book',
  },
  {
    id: '14',
    name: 'Apollo Client for Beginners',
    tagId: '2',
    __typename: 'Book',
  },
];

const authors = [
  {
    id: '1',
    name: 'J.K. Rowling',
    email: 'jV5kW@example.com',
    __typename: 'Author',
  },
  {
    id: '2',
    name: 'Michael Crichton',
    email: 'michael.crichton@me.com',
    __typename: 'Author',
  },
  {
    id: '3',
    name: 'Douglas Adams',
    email: 'douglas.adams@me.com',
    __typename: 'Author',
  },
  {
    id: '4',
    name: 'Douglas Crockford',
    email: 'douglas.crockford@me.com',
    __typename: 'Author',
  },
  {
    id: '5',
    name: 'Rayn Dahl',
    email: 'dan.brown@me.com',
    __typename: 'Author',
  },
  {
    id: '6',
    name: 'Jordan Walke',
    email: 'jordan@yopmail.com',
    __typename: 'Author',
  },
  {
    id: '7',
    name: 'Ben Newman',
    email: 'ben@eloper.dev',
    __typename: 'Author',
  },
];

const tagsByBook = {
  1: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
  2: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
  3: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
  4: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
  5: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
  6: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
  7: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
  8: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
  9: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
  10: [
    {
      id: 'L1',
      value: 'Fantasy',
    },
    {
      id: 'L2',
      value: 'Science Fiction',
    },
  ],
};

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

export { tags, books, authors, tagsByBook, additionalDetailsByBook };
