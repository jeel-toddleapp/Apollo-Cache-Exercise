import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { withLoader, Book } from './components/index.js';
import { composeHocs } from './utils.js';
import React from 'react';
import AuthorsFeedWrapper from './AuthorsFeeds.js';

import client from './client.js';

const booksQuery = gql`
  query getBooks {
    books {
      id
      name
      additionalDetailsByBook {
        id
        year
      }
    }
  }
`;

const getBooksFromCache = () => {
  return client.readQuery({
    query: booksQuery,
  });
};

const graphqlHOCConfig = {
  name: 'getBooks',
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ getBooks }) => {
    const data = getBooksFromCache();

    return {
      // books: getBooks?.books ?? [],
      books: data?.books ?? [],
      isLoading: [1, 2].includes(getBooks.networkStatus),
      // isData: !!getBooks?.books,
      isData: !!data?.books,
      refetch: getBooks.refetch,
    };
  },
};

const Books = ({ books, forceReRender, refetch }) => {
  return (
    <div>
      {books.map((book) => (
        <React.Fragment key={book.id}>
          <Book
            id={book.id}
            name={book.name}
            additionalDetailsByBook={book.additionalDetailsByBook}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default composeHocs(
  graphql(booksQuery, graphqlHOCConfig),
  // graphql(booksQueryWithError, graphqlHOCConfigWithError),
  withLoader,
)(Books);
