import React, { useState, useEffect, useRef } from 'react';

const BookItem = ({ books, book, setBooks }) => {
  const [bookDisplay, setBookDisplay] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState(book.pagesRead || 0); // Initialize with book.pagesRead or 0
  const [progress, setProgress] = useState(
    book.pagesRead ? Math.floor((book.pagesRead / book.pages) * 100) : 0 // Initialize with calculated progress or 0
  );
  const [updateButton, setUpdateButton] = useState('Edit Progress');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditable]);

  const handleViewBookInfo = () => {
    setBookDisplay((current) => !current);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditable((current) => !current);
      setUpdateButton('Edit Progress');
      setBookDisplay(false);
    }
  };

  const handleUpdateClick = () => {
    setIsEditable((current) => !current);
    setUpdateButton((current) => {
      if (current === 'Edit Progress') {
        setBookDisplay(true);
        return 'Update Progress';
      } else {
        setBookDisplay(false);
        return 'Edit Progress';
      }
    });
  };

  const handleUpdateBook = (e) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue)) {
      // Ensure inputValue is not greater than the total number of pages
      const clampedInputValue = Math.min(inputValue, book.pages);

      const newStatus = clampedInputValue === book.pages ? 'Finished Reading' : 'Currently Reading';
      const newProgress = clampedInputValue === 0 ? 0 : Math.floor((clampedInputValue / book.pages) * 100);

      const updatedBook = {
        ...book,
        pagesRead: clampedInputValue,
        status: newStatus,
      };

      setBooks((currentBooks) => {
        const updatedBooks = currentBooks.map((eachBook) => {
          if (eachBook.id === book.id) {
            return updatedBook;
          } else {
            return eachBook;
          }
        });
        return updatedBooks;
      });

      setProgress(newProgress);
      setInputValue(clampedInputValue);
    } else {
      setInputValue(0);
      setProgress(0);
    }
  };

  const handleDeleteBook = (bookId) => {
    const updatedBooks = books.filter((eachBook) => {
      return eachBook.id !== bookId;
    });
    setBooks(updatedBooks);
  };

  return (
    <>
      <li
        className='list-item'
        style={{
          backgroundColor: progress === 100 ? 'green' : 'yellow',
          borderColor: progress === 100 ? 'green' : 'yellow',
        }}
      >
        <div className='view-book' onClick={handleViewBookInfo}>
          {book.name}
        </div>
        <div
          className='book-info'
          style={{
            display: bookDisplay ? 'block' : 'none',
          }}
        >
          Author: {book.author}
          <br />
          Year Published: {book.year}
          <br />
          Pages Read:{' '}
          {isEditable ? (
            <input
              className='pages-read'
              type='number'
              value={inputValue}
              onChange={(e) => handleUpdateBook(e)}
              onKeyDown={(e) => handleEnterKeyPress(e)}
              min={0}
              max={book.pages}
              ref={inputRef}
            />
          ) : (
            <span>{inputValue}</span>
          )}{' '}
          of {book.pages} ({progress}%)
          <br />
          Genre: {book.genre}
          <div className='update-delete'>
            <button
              className='update-progress'
              onClick={(e) => {
                handleUpdateClick(e);
              }}
            >
              {updateButton}
            </button>
            <button className='delete-book' onClick={() => handleDeleteBook(book.id)}>
              Delete Book
            </button>
          </div>
        </div>
      </li>
    </>
  );
};

export default BookItem;
