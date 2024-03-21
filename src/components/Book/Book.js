import './Book.css';
import Author from './Author';
import FullScreenLoader from '../FullScreenLoader';
import _ from 'lodash';
import React from 'react';

import { useState } from 'react';

const BookViewDetails = ({ name, onEditClick }) => {
  return (
    <div className="bookInfo">
      Name: {name}
      <button onClick={onEditClick}>Edit</button>
    </div>
  );
};

const BookEditDetails = ({ name, onCancelClick, onSaveClick }) => {
  const [newName, setNewName] = useState(name);

  return (
    <div className="bookInfo">
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="editBookName"
      />
      <div className="bookEditActions">
        <button onClick={() => onSaveClick(newName)}>Save</button>
        <button onClick={onCancelClick}>Cancel</button>
      </div>
    </div>
  );
};

const Book = ({ name, id, author, changeBookName }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const onEditClick = () => {
    setIsEditing(true);
  };

  const onCancelClick = () => {
    setIsEditing(false);
  };

  const onSaveClick = async (newName) => {
    try {
      setIsLoading(true);
      await changeBookName({ id, newName });
      onCancelClick();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bookContainer">
      {!isEditing ? (
        <BookViewDetails name={name} onEditClick={onEditClick} />
      ) : (
        <BookEditDetails
          name={name}
          onCancelClick={onCancelClick}
          onSaveClick={onSaveClick}
        />
      )}
      {author ? <Author name={author.name} email={author.email} /> : null}
      {isLoading ? <FullScreenLoader /> : null}
    </div>
  );
};

export default Book;
