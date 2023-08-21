import React from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './Header';
import NewBookForm from './NewBookForm';
import BookList from './BookList';
import Footer from './Footer';

const App = () => {
  const [books, setBooks] = useState([]);
  const onSubmit = (newBook) => {
    const bookItem = {
      id: uuidv4(),
      ...newBook
    };
    setBooks(prevBooks => [...prevBooks, bookItem]);
  }
  useEffect(() => {
    try {
      const localBooks = localStorage.getItem('BOOKS');
      if (localBooks === null) {
        setBooks([]);
      } else {
        setBooks(JSON.parse(localBooks));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setBooks([]);
    }
  }, []);

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