import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { withLoader, FullScreenLoader } from './components/index.js';
import { composeHocs } from './utils.js';
import React, { useState } from 'react';

import client from './client.js';

import './AuthorsFeeds.css';

const authorsQuery = gql`
  query getAuthors {
    authors {
      id
      name
    }
  }
`;

const getAuthorsFeedFromCache = () => {
  return client.readQuery({
    query: authorsQuery,
    // debug: true,
  });
};

const graphqlHOCConfig = {
  name: 'getAuthors',
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ getAuthors }) => {
    const data = getAuthorsFeedFromCache();

    return {
      authors: data?.authors ?? [],
      isLoading: [1, 2].includes(getAuthors.networkStatus),
      isData: !!data?.authors,
    };
  },
};

const AuthorsFeed = ({ authors, assignAuthor }) => {
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const onAssignAuthor = async () => {
    setIsLoading(true);
    await assignAuthor(selectedAuthor);
    setIsLoading(false);
  };

  return (
    <div className="authorsFeedDataContainer">
      {authors.map((author) => {
        return (
          <div key={author.id} className="author">
            <input
              type="radio"
              checked={author.id === selectedAuthor}
              onChange={() => {
                setSelectedAuthor(author.id);
              }}
            />
            <div>{author.name}</div>
          </div>
        );
      })}
      <button onClick={onAssignAuthor}>Assign author</button>
      {isLoading && <FullScreenLoader />}
    </div>
  );
};

const AuthorsFeedHoc = composeHocs(
  graphql(authorsQuery, graphqlHOCConfig),
  withLoader,
)(AuthorsFeed);

const AuthorsFeedWrapper = (props) => {
  return (
    <div className="authorsFeedsContainer">
      <AuthorsFeedHoc {...props} />
    </div>
  );
};

export default AuthorsFeedWrapper;
