import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { withLoader, Book } from './components';
import { useMutation } from '@apollo/client/react/hooks';
import { composeHocs } from './utils.js';
import React from 'react';

import client from './client.js';

const booksQuery = gql`
  query getBooks {
    books {
      id
      name
      author {
        id
        name
        email
      }
    }
  }
`;

const changeBookNameMutation = gql`
  mutation changeBookName($id: ID, $newName: String) {
    updateBook(id: $id, name: $newName) {
      id
      name
      author {
        # id
        name
      }
    }
  }
`;

const getBooksFromCache = () => {
  return client.readQuery({
    query: booksQuery,
    // debug: true,
  });
};

const graphqlHOCConfig = {
  name: 'getBooks',
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ getBooks }) => {
    const data = getBooksFromCache();

    console.log('data', data);

    return {
      // books: getBooks?.books ?? [],
      books: data?.books ?? [],
      isLoading: [1, 2].includes(getBooks.networkStatus),
      // isData: !!getBooks?.books,
      isData: !!data?.books,
    };
  },
};

const Books = ({ books, forceReRender }) => {
  const [changeBookName] = useMutation(changeBookNameMutation);

  return (
    <div>
      {books.map((book) => (
        <React.Fragment key={book.id}>
          <Book
            id={book.id}
            name={book.name}
            author={book.author}
            changeBookName={async ({ id, newName }) => {
              await changeBookName({ variables: { id, newName } });
              forceReRender();
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default composeHocs(
  graphql(booksQuery, graphqlHOCConfig),
  withLoader,
)(Books);
