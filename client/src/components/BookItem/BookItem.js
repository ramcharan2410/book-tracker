import React, { useState, useEffect, useRef } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import './bookItem.css'

const BookItem = ({
  userName,
  books,
  book,
  setBooks,
  handleSetCurrReading,
}) => {
  const [bookDisplay, setBookDisplay] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [inputValue, setInputValue] = useState(book.pagesRead || 0)
  const [progress, setProgress] = useState(
    book.pagesRead ? Math.floor((book.pagesRead / book.pages) * 100) : 0
  )
  const [updateButton, setUpdateButton] = useState('Edit Progress')
  const inputRef = useRef(null)

  const localhost_server_addr = process.env.REACT_APP_LOCALHOST_SERVER_ADDR
  const vercel_server_addr = process.env.REACT_APP_VERCEL_SERVER_ADDR

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditable])

  const handleViewBookInfo = () => {
    setBookDisplay((current) => !current)
  }

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditable((current) => !current)
      setUpdateButton('Edit Progress')
      setBookDisplay(false)
    }
  }

  const handleUpdateClick = () => {
    setIsEditable((current) => !current)
    setUpdateButton((current) => {
      if (current === 'Edit Progress') {
        setBookDisplay(true)
        return 'Update Progress'
      } else {
        setBookDisplay(false)
        return 'Edit Progress'
      }
    })
  }

  const handleUpdateBook = async (e) => {
    const inputValue = parseFloat(e.target.value)

    if (!isNaN(inputValue)) {
      const updatedInputValue = Math.min(inputValue, book.pages)

      const newStatus =
        updatedInputValue === book.pages
          ? 'Finished Reading'
          : 'Currently Reading'
      const newProgress =
        updatedInputValue === 0
          ? 0
          : Math.floor((updatedInputValue / book.pages) * 100)

      const updatedBook = {
        ...book,
        pagesRead: updatedInputValue,
        status: newStatus,
      }

      try {
        const response = await fetch(
          `${vercel_server_addr}/users/${userName}/updateBook/${book.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBook),
          }
        )

        const data = await response.json()

        if (data.message === 'Book updated successfully') {
          setBooks((currentBooks) =>
            currentBooks.map((eachBook) =>
              eachBook.id === book.id ? updatedBook : eachBook
            )
          )
        }
      } catch (error) {
        console.error('Error updating book:', error)
      }

      setProgress(newProgress)
      setInputValue(updatedInputValue)
    } else {
      setInputValue(0)
      setProgress(0)
    }
  }

  const handleDeleteBook = async (bookId) => {
    const updatedBooks = books.filter((eachBook) => {
      return eachBook.id !== bookId
    })
    try {
      const response = await fetch(`/users/${userName}/deleteBook/${book.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.message === 'Book deleted successfully') {
        setBooks(updatedBooks)
      }
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  return (
    <>
      {book.status !== 'Plan to Read' ? (
        <li
          className="list-item"
          style={{
            backgroundColor: progress === 100 ? 'green' : 'yellow',
            borderColor: progress === 100 ? 'green' : 'yellow',
          }}
        >
          <div className="view-book" onClick={handleViewBookInfo}>
            {book.name}
          </div>
          <div
            className="book-info"
            style={{
              display: bookDisplay ? 'block' : 'none',
            }}
          >
            Author: {book.author}
            <br />
            Year Published: {book.year}
            <br />
            Genre: {book.genre}
            <br />
            Pages Read:{' '}
            {isEditable ? (
              <input
                className="pages-read"
                type="number"
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
            <LinearProgress variant="determinate" value={progress} />
            <br />
            <div className="update-delete">
              <button
                className="update-progress"
                onClick={(e) => {
                  handleUpdateClick(e)
                }}
              >
                {updateButton}
              </button>
              <button
                className="delete-book"
                onClick={() => handleDeleteBook(book.id)}
              >
                Delete Book
              </button>
            </div>
          </div>
        </li>
      ) : (
        <li
          className="list-item"
          style={{
            backgroundColor: 'white',
            borderColor: 'white',
          }}
        >
          <div className="view-book" onClick={handleViewBookInfo}>
            {book.name}
          </div>
          <div
            className="book-info"
            style={{
              display: bookDisplay ? 'block' : 'none',
            }}
          >
            Author: {book.author}
            <br />
            Year Published: {book.year}
            <br />
            Pages Read: 0 of {book.pages} ({progress}%)
            <br />
            Genre: {book.genre}
            <div className="update-delete">
              <button
                className="set-curr-reading"
                onClick={() => {
                  handleSetCurrReading(book.id)
                }}
              >
                Currently Reading?
              </button>
              <button
                className="delete-book"
                onClick={() => handleDeleteBook(book.id)}
              >
                Delete Book
              </button>
            </div>
          </div>
        </li>
      )}
    </>
  )
}

export default BookItem
