import React from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './Header';
import NewBookForm from './NewBookForm';
import BookList from './BookList';
import Footer from './Footer';

const App = () => {
  const [books, setBooks] = useState(() => {
    const localBooks = localStorage.getItem('BOOKS');
    if (localBooks === null) {
      return [];
    }
    else {
      return JSON.parse(localBooks);
    }
  });
  const onSubmit = (newBook) => {
    const bookItem = {
      id: uuidv4(),
      ...newBook
    };
    setBooks(prevBooks => [...prevBooks, bookItem]);
  }

  useEffect(() => {
    localStorage.setItem('BOOKS', JSON.stringify(books));
  }, [books]);
  return (
    <>
      <Header />
      <div className='container'>
        <NewBookForm onSubmit={onSubmit} />
        <BookList books={books} setBooks={setBooks} />
      </div>
      <Footer />
    </>
  )
}

export default App