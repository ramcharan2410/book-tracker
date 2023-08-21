import { useState } from 'react';

import React from 'react'

const NewBookForm = ({ onSubmit }) => {
    const [addButton, setAddButton] = useState('Add New Book');
    const [formDisplay, setFormDisplay] = useState(false);
    const [newBook, setNewBook] = useState({
        name: '',
        author: '',
        year: null,
        genre: '',
        pages: null,
        status: 'Select a status',
        pagesRead: null
    })
    const getCurrentYear = () => {
        const today = new Date();
        return today.getFullYear();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newBook);
        handleFormChange();
        setNewBook({
            name: '',
            author: '',
            year: null,
            genre: '',
            pages: null,
            status: 'Select a status',
            pagesRead: null
        });
        setFormDisplay(false);
    }
    const handleFormChange = () => {
        setFormDisplay(current => !current);
        setAddButton(current => current = (current === 'Add New Book') ? 'Close form' : 'Add New Book');
    }
    const changeNewBookInfo = (e) => {
        const { name, value } = e.target;

        if (name === 'status' && value === 'Finished Reading') {
            const pages = parseFloat(newBook.pages);
            setNewBook({ ...newBook, status: 'Finished Reading', pagesRead: pages });
        } else if (name === 'year' || name === 'pages' || name === 'pagesRead') {
            const numericValue = parseFloat(value);
            setNewBook({ ...newBook, [name]: numericValue });
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };
    const handleDeleteForm = () => {
        handleFormChange();
        setNewBook({
            name: '',
            author: '',
            year: null,
            genre: '',
            pages: null,
            status: 'Select a status',
            pagesRead: null
        });
    }
    return (
        <>
            <button className='add-new-book' onClick={() => {
                handleFormChange();
            }}>{addButton}</button>
            <form
                onSubmit={(e) => handleSubmit(e)}
                className='new-book-form'
                style={{ display: formDisplay ? 'block' : 'none' }}
            >
                <div className='new-book-details'
                >
                    <label htmlFor='name'>Name of the Book: </label>
                    <input
                        value={newBook.name}
                        id='name'
                        name='name'
                        type='text'
                        onChange={(e) => changeNewBookInfo(e)}
                        required
                    />
                    <br />
                    <label htmlFor='author'>Author: </label>
                    <input
                        value={newBook.author}
                        id='author'
                        name='author'
                        type='text'
                        onChange={(e) => changeNewBookInfo(e)}
                        required
                    />
                    <br />
                    <label htmlFor='year'>Year Published: </label>
                    <input
                        value={(newBook.year === null) ? '' : newBook.year}
                        id='year'
                        name='year'
                        type='number'
                        onChange={(e) => changeNewBookInfo(e)}
                        max={getCurrentYear()}
                        min={1000}
                        required
                    />
                    <br />
                    <label htmlFor='genre'>Genre: </label>
                    <input
                        value={newBook.genre}
                        id='genre'
                        name='genre'
                        type='text'
                        onChange={(e) => changeNewBookInfo(e)}
                        required
                    />
                    <br />
                    <label htmlFor='pages'>Total Pages: </label>
                    <input
                        value={(newBook.pages === null) ? '' : newBook.pages}
                        id='pages'
                        name='pages'
                        min={0}
                        type='number'
                        onChange={(e) => { changeNewBookInfo(e) }}
                        required
                    />
                    <br />
                    <label htmlFor='status'>Status: </label>
                    <select
                        name='status'
                        id='status'
                        onChange={(e) => changeNewBookInfo(e)}
                        value={newBook.status}
                        required
                    >
                        <option value='' hidden>Select a status</option>
                        <option
                            value='Currently Reading'
                            id='currently-reading'
                        >Currently Reading</option>
                        <option
                            value='Finished Reading'
                            id='finished-reading'
                        >Finished Reading</option>
                        <option
                            value='Plan to Read'
                            id='plan-to-read'
                        >Plan to Read</option>
                    </select>

                    <div
                        className='curr-reading'
                        style={{ display: (newBook.status === 'Currently Reading') ? 'block' : 'none' }}
                    >
                        <label htmlFor='curr-page'>Pages Read: </label>
                        <input
                            value={(newBook.pagesRead === null) ? '' : newBook.pagesRead}
                            name='pagesRead'
                            type='number'
                            id='curr-page'
                            onChange={(e) => { changeNewBookInfo(e) }}
                            max={parseInt(newBook.pages)}
                            required={newBook.status === 'Currently Reading'}
                        />
                    </div>
                    <br />
                    <div className='add-delete'>
                        <button
                            id='add'
                            className='add'
                            type='submit'
                        >Add</button>
                        <button
                            id='delete'
                            className='delete'
                            onClick={handleDeleteForm}
                        >Delete</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default NewBookForm