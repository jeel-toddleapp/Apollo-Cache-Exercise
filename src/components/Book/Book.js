import './Book.css';
import Author from './Author';
import FullScreenLoader from '../FullScreenLoader';
import _ from 'lodash';
import React from 'react';

const BookViewDetails = ({ name }) => {
  return <div className="bookInfo">Name: {name}</div>;
};

const AdditionalDetails = ({ id, year }) => {
  return (
    <div className="additionalDetails">
      <div>
        Year: <b>{year}</b>
      </div>
    </div>
  );
};

const Book = ({ name, id, additionalDetailsByBook }) => {
  return (
    <div className="bookContainer">
      <BookViewDetails name={name} />

      {!_.isEmpty(additionalDetailsByBook) ? (
        <div className="additionalInfoContainer">
          <div className="additionalInfoContainerHeader">
            Years of publication
          </div>
          {_.map(additionalDetailsByBook, (additionalDetails) => (
            <AdditionalDetails
              id={additionalDetails.id}
              year={additionalDetails.year}
              key={additionalDetails.id}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Book;
