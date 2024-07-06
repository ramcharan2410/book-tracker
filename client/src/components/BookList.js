import { useState } from 'react'
import BookItem from './BookItem.js'
import React from 'react'

const BookList = ({ userName, books, setBooks }) => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const countBooksByCategory = (category) => {
    if (category === 'All') {
      return books.length
    }
    const filteredBooks = books.filter((book) => {
      return book.status === category
    })
    return filteredBooks.length
  }
  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
  }
  const handleSetCurrReading = (bookId) => {
    setBooks((currBooks) => {
      const updatedBooks = currBooks.map((book) => {
        if (book.id === bookId) {
          return { ...book, status: 'Currently Reading' }
        } else {
          return book
        }
      })
      return updatedBooks
    })
  }
  const filteredBooks = books.filter((book) => {
    if (selectedCategory === 'All') {
      return true
    }
    return book.status === selectedCategory
  })
  return (
    <div className="book-list-container">
      <div className="status-bar">
        <button
          onClick={() => handleCategoryClick('All')}
          className={selectedCategory === 'All' ? 'active' : ''}
        >
          All: {countBooksByCategory('All')}
        </button>
        <button
          onClick={() => handleCategoryClick('Currently Reading')}
          className={selectedCategory === 'Currently Reading' ? 'active' : ''}
        >
          Currently Reading: {countBooksByCategory('Currently Reading')}
        </button>
        <button
          onClick={() => handleCategoryClick('Finished Reading')}
          className={selectedCategory === 'Finished Reading' ? 'active' : ''}
        >
          Finished Reading: {countBooksByCategory('Finished Reading')}
        </button>
        <button
          onClick={() => handleCategoryClick('Plan to Read')}
          className={selectedCategory === 'Plan to Read' ? 'active' : ''}
        >
          Plan to Read: {countBooksByCategory('Plan to Read')}
        </button>
      </div>
      {filteredBooks.length > 0 ? (
        <div className="book-list">
          <ul className="list">
            {filteredBooks.map((book) => {
              return (
                <BookItem
                  userName={userName}
                  book={book}
                  books={books}
                  setBooks={setBooks}
                  key={book.id}
                  handleSetCurrReading={handleSetCurrReading}
                />
              )
            })}
          </ul>
        </div>
      ) : (
        <p className="no-books">No Books in this Category</p>
      )
      }
    </div >
  )
}

export default BookList
