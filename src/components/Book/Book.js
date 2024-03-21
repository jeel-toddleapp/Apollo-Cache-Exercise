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

const AdditionalDetails = ({ id, year, pricePerUnit, totalSell }) => {
  return (
    <div className="additionalDetails">
      <div>
        Year: <b>{year}</b>
      </div>
      <div>
        Price per unit: <b>{pricePerUnit}</b>
      </div>
      <div>
        Total sell: <b>{totalSell}</b>
      </div>
    </div>
  );
};

const AddAdditionalDetails = ({ bookName, closeModal, onSaveClick }) => {
  const [details, setDetails] = useState([
    {
      year: '',
      pricePerUnit: '',
      totalSell: '',
    },
    {
      year: '',
      pricePerUnit: '',
      totalSell: '',
    },
  ]);

  const updateDetails = (index, key, value) => {
    setDetails((details) =>
      details.map((detail, i) => {
        if (i === index) {
          return {
            ...detail,
            [key]: value,
          };
        }
        return detail;
      }),
    );
  };

  return (
    <div className="additionalDetailsInputModal">
      <div className="additionalDetailsContent">
        <div className="additionalDetailsHeader">
          {bookName}
          <button onClick={closeModal}>X</button>
        </div>
        <div className="additionalDetailsForm">
          {_.map(details, (detail, index) => {
            return (
              <div className="additionalDetailsYearWiseInfo" key={index}>
                <div className="inputFieldWrapper">
                  year:
                  <input
                    type="text"
                    value={detail.year}
                    onChange={(e) =>
                      updateDetails(index, 'year', e.target.value)
                    }
                  />
                </div>
                <div className="inputFieldWrapper">
                  pricePerUnit:
                  <input
                    type="text"
                    value={detail.pricePerUnit}
                    onChange={(e) =>
                      updateDetails(index, 'pricePerUnit', e.target.value)
                    }
                  />
                </div>
                <div className="inputFieldWrapper">
                  totalSell:
                  <input
                    type="text"
                    value={detail.totalSell}
                    onChange={(e) =>
                      updateDetails(index, 'totalSell', e.target.value)
                    }
                  />
                </div>
              </div>
            );
          })}
          <button onClick={() => onSaveClick(details)}>Save</button>
        </div>
      </div>
    </div>
  );
};

const Book = ({
  name,
  id,
  author,
  tags,
  changeBookName,
  assignAuthor,
  additionalDetailsByBook,
  changeAdditionalDetails,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isAddingAdditionalDetails, setIsAddingAdditionalDetails] =
    useState(false);

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

  const onChangeAdditionalDetailsLocal = async (details) => {
    try {
      setIsLoading(true);
      await changeAdditionalDetails({ id, details });
      setIsAddingAdditionalDetails(false);
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
      {author ? (
        <Author name={author.name} email={author.email} />
      ) : (
        <button onClick={() => assignAuthor({ id })} className="assignAuthor">
          Assign author
        </button>
      )}
      {!_.isEmpty(tags) ? (
        <div className="tagsContainer">
          Tags:
          <div className="tagsList">
            {tags.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.value}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {!_.isEmpty(additionalDetailsByBook) ? (
        <div className="additionalInfoContainer">
          <div className="additionalInfoContainerHeader">
            Book performance in market since its publication
          </div>
          {_.map(additionalDetailsByBook, (additionalDetails) => (
            <AdditionalDetails
              id={additionalDetails.id}
              year={additionalDetails.year}
              pricePerUnit={additionalDetails.pricePerUnit}
              totalSell={additionalDetails.totalSell}
            />
          ))}
        </div>
      ) : (
        <button
          onClick={() => setIsAddingAdditionalDetails(true)}
          className="assignAuthor"
        >
          Add book performance details
        </button>
      )}
      {isAddingAdditionalDetails ? (
        <AddAdditionalDetails
          bookName={name}
          closeModal={() => setIsAddingAdditionalDetails(false)}
          onSaveClick={onChangeAdditionalDetailsLocal}
        />
      ) : null}
      {isLoading ? <FullScreenLoader /> : null}
    </div>
  );
};

export default Book;
