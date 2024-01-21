const express = require('express')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const app = express()
app.use(morgan('tiny')) // console.log(details of the HTTP request)
app.use(express.json()) // for parsing JSON requests
app.use(cors())
// const PORT = 3001
const vercelDeployment = 'https://book-tracker-backend.vercel.app'

let db
const initializeDatabase = async () => {
  try {
    db = await open({
      filename: 'database.db',
      driver: sqlite3.Database,
    })

    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT UNIQUE NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `)

    await db.exec(`
    CREATE TABLE IF NOT EXISTS userBooks (
      id TEXT PRIMARY KEY,
      userName TEXT NOT NULL,
      name TEXT NOT NULL,
      author TEXT NOT NULL,
      year INTEGER NOT NULL,
      pages INTEGER NOT NULL,
      genre TEXT NOT NULL, 
      status TEXT NOT NULL,
      pagesRead INTEGER
    )
  `)
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

initializeDatabase()

const saltRounds = 10

app.post('/signup', async (req, res) => {
  // console.log(req.body)
  const { userName, email, password } = req.body
  try {
    const existingUserName = await db.get(
      'SELECT * FROM users WHERE userName = ?',
      [userName]
    )
    const existingEmail = await db.get('SELECT * FROM users WHERE email = ?', [
      email,
    ])
    if (existingUserName) {
      return res.status(409).json({ message: 'UserName already exists' })
      // 409 => Resource already exists
    }
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' })
      // 409 => Resource already exists
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)
    await db.run(
      'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
      [userName, email, hashedPassword]
    )
    return res
      .status(200)
      .json({ message: 'Signup successful', userName: userName, email: email })
  } catch (err) {
    console.error('Signup error:', err)
    return res
      .status(400)
      .json({ message: 'Signup failed: Internal Server Error' })
  }
})

app.post('/login', async (req, res) => {
  // console.log(req.body)
  const { userName, password } = req.body
  try {
    const row = await db.get('SELECT * FROM users WHERE userName = ?', [
      userName,
    ])
    // console.log(row)
    if (row) {
      const match = await bcrypt.compare(password, row.password)

      if (match) {
        return res.status(200).json({
          message: 'Login successful',
          userName: row.userName,
          email: row.email,
        })
      } else {
        return res
          .status(401)
          .json({ message: 'Login failed: Invalid credentials' })
        // 401 => Unauthorized
      }
    } else {
      return res.status(404).json({ message: 'Login failed: User not found' })
      // 404 => Not Found
    }
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

app.post('/users/:userName/addBook', async (req, res) => {
  const { userName } = req.params
  const { bookItem } = req.body
  // console.log(userName, bookItem)
  const existingBook = await db.get(
    'SELECT * FROM userBooks WHERE userName = ? AND name = ?',
    [userName, bookItem.name]
  )
  if (existingBook) {
    return res.status(400).json({
      message: 'Book already exists',
    })
  }
  try {
    await db.run(
      `
      INSERT INTO userBooks (id, userName, name, author, year, pages, genre, status, pagesRead)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        bookItem.id,
        userName,
        bookItem.name,
        bookItem.author,
        bookItem.year,
        bookItem.pages,
        bookItem.genre,
        bookItem.status,
        bookItem.pagesRead,
      ]
    )
    return res.status(200).json({ message: 'Book added successfully' })
  } catch (error) {
    console.error('Error adding book:', error)
    return res
      .status(500)
      .json({ error: 'Internal Server Error', message: error.message })
  }
})

app.get('/user/:userName/books', async (req, res) => {
  const { userName } = req.params

  try {
    const books = await db.all(
      `
      SELECT * FROM userBooks
      WHERE userName = ?
    `,
      [userName]
    )

    return res.status(200).json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.put('/users/:userName/updateBook/:id', async (req, res) => {
  const { userName, id } = req.params
  const { pagesRead, status } = req.body

  try {
    await db.run(
      `
      UPDATE userBooks
      SET pagesRead = ?,
          status = ?
      WHERE userName = ? AND id = ?
    `,
      [pagesRead, status, userName, id]
    )
    return res.status(200).json({ message: 'Book updated successfully' })
  } catch (error) {
    console.error('Error updating book:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})
app.delete('/users/:userName/deleteBook/:id', async (req, res) => {
  const { userName, id } = req.params

  try {
    await db.run(
      `
      DELETE FROM userBooks
      WHERE userName = ? AND id = ?
    `,
      [userName, id]
    )

    return res.status(200).json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.listen(vercelDeployment, () => {
  console.log(`Server is running on ${vercelDeployment}`)
})
