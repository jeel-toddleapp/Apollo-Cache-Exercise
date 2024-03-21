import './Book.css';
import Author from './Author';
import FullScreenLoader from '../FullScreenLoader';
import _ from 'lodash';
import React from 'react';

const BookViewDetails = ({ name }) => {
  return <div className="bookInfo">Name: {name}</div>;
};

const Book = ({ name, id, author, assignAuthor, changeAdditionalDetails }) => {
  return (
    <div className="bookContainer">
      <BookViewDetails name={name} />

      {author ? (
        <Author name={author.name} email={author.email} />
      ) : (
        <button onClick={() => assignAuthor({ id })} className="assignAuthor">
          Assign author
        </button>
      )}
    </div>
  );
};

export default Book;
