import { useState } from 'react'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import './newBookForm.css'

const NewBookForm = ({ userName, setBooks }) => {
  const [addButton, setAddButton] = useState('Add New Book')
  const [formDisplay, setFormDisplay] = useState(false)
  const [bookAlreadyPresent, setBookAlreadyPresent] = useState(false)
  const [newBook, setNewBook] = useState({
    name: '',
    author: '',
    year: null,
    genre: '',
    pages: null,
    status: 'Select a status',
    pagesRead: null,
  })
  const renderServerAddr = 'https://book-tracker-backend.onrender.com'
  const onSubmit = async (newBook) => {
    const bookItem = {
      id: uuidv4(),
      ...newBook,
    }
    try {
      const response = await fetch(
        `${renderServerAddr}/users/${userName}/addBook`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // if body: JSON.stringify(bookItem) and at server
          // const {bookItem} = req.body; Then bookItem will be undefined
          body: JSON.stringify({ bookItem }),
        }
      )
      const data = await response.json()
      if (data.message === 'Book already exists') {
        setBookAlreadyPresent(true)
      } else if (data.message === 'Book added successfully') {
        setBooks((prevBooks) => [...prevBooks, bookItem])
        setBookAlreadyPresent(false)
      }
    } catch (error) {
      console.error('Error adding book:', error)
      setBookAlreadyPresent(false)
    }
  }
  const getCurrentYear = () => {
    const today = new Date()
    return today.getFullYear()
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(newBook)
    if (!bookAlreadyPresent) {
      handleFormChange()
      setNewBook({
        name: '',
        author: '',
        year: null,
        genre: '',
        pages: null,
        status: 'Select a status',
        pagesRead: null,
      })
    } else {
      setFormDisplay(true)
    }
  }
  const handleFormChange = () => {
    setFormDisplay((current) => !current)
    setAddButton(
      (current) =>
        (current = current === 'Add New Book' ? 'Close form' : 'Add New Book')
    )
  }
  const changeNewBookInfo = (e) => {
    if (bookAlreadyPresent) {
      setBookAlreadyPresent(false)
    }
    const { name, value } = e.target
    if (
      name === 'status' &&
      (value === 'Currently Reading' || value === 'Plan to Read')
    ) {
      newBook.pagesRead = ''
    }
    if (name === 'status' && value === 'Finished Reading') {
      const pages = parseInt(newBook.pages)
      setNewBook({ ...newBook, status: 'Finished Reading', pagesRead: pages })
    } else if (name === 'year' || name === 'pages' || name === 'pagesRead') {
      const numericValue = parseInt(value)
      setNewBook({ ...newBook, [name]: numericValue })
    } else {
      setNewBook({ ...newBook, [name]: value })
    }
  }
  const handleDeleteForm = () => {
    handleFormChange()
    setNewBook({
      name: '',
      author: '',
      year: null,
      genre: '',
      pages: null,
      status: 'Select a status',
      pagesRead: null,
    })
  }
  return (
    <>
      <button
        className="add-new-book"
        onClick={() => {
          handleFormChange()
        }}
      >
        {addButton}
      </button>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="new-book-form"
        style={{ display: formDisplay ? 'block' : 'none' }}
        noValidate // should be resolved as soon as possible
      >
        <div className="new-book-details">
          <label htmlFor="name">Name of the Book: </label>
          <input
            value={newBook.name}
            id="name"
            name="name"
            type="text"
            onChange={(e) => changeNewBookInfo(e)}
            required
          />
          <br />
          <label htmlFor="author">Author: </label>
          <input
            value={newBook.author}
            id="author"
            name="author"
            type="text"
            onChange={(e) => changeNewBookInfo(e)}
            required
          />
          <br />
          <label htmlFor="year">Year Published: </label>
          <input
            value={newBook.year === null ? '' : newBook.year}
            id="year"
            name="year"
            type="number"
            onChange={(e) => changeNewBookInfo(e)}
            max={getCurrentYear()}
            min={1000}
            required
          />
          <br />
          <label htmlFor="genre">Genre: </label>
          <input
            value={newBook.genre}
            id="genre"
            name="genre"
            type="text"
            onChange={(e) => changeNewBookInfo(e)}
            required
          />
          <br />
          <label htmlFor="pages">Total Pages: </label>
          <input
            value={newBook.pages === null ? '' : newBook.pages}
            id="pages"
            name="pages"
            min={1}
            type="number"
            onChange={(e) => {
              changeNewBookInfo(e)
            }}
            required
          />
          <br />
          <label htmlFor="status">Status: </label>
          <select
            name="status"
            id="status"
            onChange={(e) => changeNewBookInfo(e)}
            value={newBook.status}
            required
          >
            <option value="" hidden>
              Select a status
            </option>
            <option value="Currently Reading" id="currently-reading">
              Currently Reading
            </option>
            <option value="Finished Reading" id="finished-reading">
              Finished Reading
            </option>
            <option value="Plan to Read" id="plan-to-read">
              Plan to Read
            </option>
          </select>

          <div
            className="curr-reading"
            style={{
              display:
                newBook.status === 'Currently Reading' ? 'block' : 'none',
            }}
          >
            <label htmlFor="curr-page">Pages Read: </label>
            <input
              value={newBook.pagesRead === null ? '' : newBook.pagesRead}
              name="pagesRead"
              type="number"
              id="curr-page"
              onChange={(e) => {
                changeNewBookInfo(e)
              }}
              max={parseInt(newBook.pages) - 1}
            />
          </div>
          <br />

          <p
            className="book-already-present"
            style={{ display: bookAlreadyPresent ? 'block' : 'none' }}
          >
            This book is already present in your library
          </p>
        </div>
        <div className="add-delete">
          <button id="add" className="add" type="submit">
            Add
          </button>
          <button id="delete" className="delete" onClick={handleDeleteForm}>
            Delete
          </button>
        </div>
      </form>
    </>
  )
}

export default NewBookForm
