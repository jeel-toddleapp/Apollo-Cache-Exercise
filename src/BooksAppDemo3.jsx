import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { withLoader, Book } from './components/index.js';
import { useMutation } from '@apollo/client/react/hooks';
import { composeHocs } from './utils.js';
import React from 'react';
import AuthorsFeedWrapper from './AuthorsFeeds.js';

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
      additionalDetailsByBook {
        id
        year
        pricePerUnit
        totalSell
      }
    }
  }
`;

const booksQueryWithError = gql`
  query getBooksWithError {
    books {
      id
      name
      author {
        id
        name
        email
      }
      additionalDetailsByBook {
        id
        year
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

const changeBookAuthorMutation = gql`
  mutation changeBookAuthor($id: ID, $authorId: ID) {
    updateBook(id: $id, authorId: $authorId) {
      id
      author {
        id
        name
        email
      }
    }
  }
`;

const changeAdditionalDetailsMutation = gql`
  mutation changeAdditionalDetails(
    $id: ID
    $details: [AdditionalDetailsByBookInput]
  ) {
    updateBook(id: $id, additionalDetails: $details) {
      id
      additionalDetailsByBook {
        id
        year
        pricePerUnit
        totalSell
      }
    }
  }
`;

const BookWithAuthorName = gql`
  query BookWithAuthorName {
    favoriteBook {
      id
      author {
        name
      }
    }
  }
`;

const BookWithAuthorBirthdate = gql`
  query BookWithAuthorBirthdate {
    favoriteBook {
      id
      author {
        dateOfBirth
      }
    }
  }
`;

const getBooksFromCache = () => {
  return client.readQuery({
    query: booksQuery,
    debug: true,
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

// const graphqlHOCConfigWithError = {
//   name: 'getBooksWithError',
//   skip: () => false,
//   options: () => ({
//     fetchPolicy: 'cache-only',
//     // refetchWritePolicy: 'merge',
//   }),
//   props: ({ getBooksWithError }) => {
//     // const data = getBooksFromCache();

//     return {
//       // books: getBooks?.books ?? [],
//       // books: data?.books ?? [],
//       // isLoading: [1, 2].includes(getBooksWithError.networkStatus),
//       // isData: !!getBooks?.books,
//       // isData: !!data?.books,
//       refetch: getBooksWithError.refetch,
//     };
//   },
// };

const Books = ({ books, forceReRender, refetch }) => {
  const [changeBookName] = useMutation(changeBookNameMutation);

  const [changeBookAuthor] = useMutation(changeBookAuthorMutation);

  const [changeAdditionalDetails] = useMutation(
    changeAdditionalDetailsMutation,
  );

  const [selectedBookId, setSelectedBookId] = React.useState('');

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
            assignAuthor={({ id }) => setSelectedBookId(id)}
            additionalDetailsByBook={book.additionalDetailsByBook}
            changeAdditionalDetails={async ({ id, details }) => {
              await changeAdditionalDetails({
                variables: { id, details },
              });

              // await refetch();
              forceReRender();
            }}
          />
        </React.Fragment>
      ))}
      {selectedBookId ? (
        <AuthorsFeedWrapper
          assignAuthor={async (authorId) => {
            await changeBookAuthor({
              variables: { id: selectedBookId, authorId },
            });
            setSelectedBookId('');
            forceReRender();
          }}
        />
      ) : null}
    </div>
  );
};

export default composeHocs(
  graphql(booksQuery, graphqlHOCConfig),
  // graphql(booksQueryWithError, graphqlHOCConfigWithError),
  withLoader,
)(Books);
