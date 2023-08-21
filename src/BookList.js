import { useState } from 'react';
import BookItem from './BookItem';

import React from 'react'

const BookList = ({ books, setBooks }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const countBooksByCategory = (category) => {
    if (category === 'All') {
      return books.length;
    }
    const filteredBooks = books.filter((book) => {
      return book.status === category;
    });
    return filteredBooks.length;
  }
  // const [categoryCounts, setCategoryCounts] = useState({
  //   'All': countBooksByCategory('All'),
  //   'Currently Reading': countBooksByCategory('Currently Reading'),
  //   'Finished Reading': countBooksByCategory('Finished Reading'),
  //   'Plan to Read': countBooksByCategory('Plan to Read')
  // })
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  }
  const filteredBooks = books.filter((book) => {
    if (selectedCategory === 'All') {
      return true;
    }
    return book.status === selectedCategory;
  });
  const mid = Math.ceil(filteredBooks.length / 2);
  const leftColumnBooks = filteredBooks.slice(0, mid);
  const rightColumnBooks = filteredBooks.slice(mid);
  return (
    <>
      <div className='status-bar'>
        <button onClick={() => handleCategoryClick('All')}
        >All: {countBooksByCategory('All')}</button>
        <button onClick={() => handleCategoryClick('Currently Reading')}
        >Currently Reading: {countBooksByCategory('Currently Reading')}</button>
        <button onClick={() => handleCategoryClick('Finished Reading')}
        >Finished Reading: {countBooksByCategory('Finished Reading')}</button>
        <button onClick={() => handleCategoryClick('Plan to Read: ')}
        >Plan to Read: {countBooksByCategory('Plan to Read')}</button>
      </div>
      {filteredBooks.length > 0 ? (
        <div className='book-list-container'>
          <div className='book-list-column'>
            <ul className='list'>
              {leftColumnBooks.map((book) => {
                return (
                  <BookItem
                    book={book}
                    books={books}
                    setBooks={setBooks}
                    key={book.id}
                  />
                );
              })}
            </ul>
          </div>
          <div className='book-list-column'>
            <ul className='list'>
              {rightColumnBooks.map((book) => {
                return (
                  <BookItem
                    book={book}
                    books={books}
                    setBooks={setBooks}
                    key={book.id}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      ) : (<p>No Books in this Category</p >)
      }
    </>
  )
}

export default BookList