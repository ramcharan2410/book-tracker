const express = require('express')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const app = express()
app.use(morgan('tiny')) // console.log(details of the HTTP request)
app.use(express.json()) // for parsing JSON requests
const corsOptions = {
  origin: 'http://localhost:3000',
}
app.use(cors(corsOptions))

const PORT = 3001

let db

const initializeDatabase = async () => {
  db = await open({
    filename: 'database.db',
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS userBooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT, 
      bookId INTEGER UNIQUE,
      bookName TEXT UNIQUE,
      author TEXT,
      year INTEGER,
      pages INTEGER,
      genre TEXT,
      status TEXT,
      pagesRead INTEGER
    )
  `)
}

initializeDatabase()

const saltRounds = 10

app.post('/login', async (req, res) => {
  console.log(req.body)
  const { action, userName, email, password } = req.body
  console.log(action, userName, email, password)
  if (action === 'signup') {
    try {
      const existingUser = await db.get(
        'SELECT * FROM users WHERE userName = ? OR email = ?',
        [userName, email]
      )
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' })
        // 409 => Resource already exists
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds)
      await db.run(
        'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
        [userName, email, hashedPassword]
      )
      return res.status(200).json({ message: 'Signup successful' })
    } catch (err) {
      console.error('Signup error:', err)
      return res
        .status(400)
        .json({ message: 'Signup failed: Internal Server Error' })
    }
  } else {
    try {
      const row = await db.get('SELECT * FROM users WHERE userName = ?', [
        userName,
      ])
      console.log(row)
      if (row) {
        const match = await bcrypt.compare(password, row.password)

        if (match) {
          return res.status(200).json({ message: 'Login successful' })
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
  }
})

app.post('/:userName/addBook', async (req, res) => {
  const { userName } = req.params
  const newBook = req.body
  console.log(newBook)
  try {
    await db.run(
      `
      INSERT INTO userBooks (userName, bookId, bookName, author, year, pages, genre, status, pagesRead)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        userName,
        newBook.id,
        newBook.name,
        newBook.author,
        newBook.year,
        newBook.pages,
        newBook.genre,
        newBook.status,
        newBook.pagesRead,
      ]
    )

    return res.status(200).json({ message: 'Book added successfully' })
  } catch (error) {
    console.error('Error adding book:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.get('/:userName/books', async (req, res) => {
  const { userName } = req.params

  try {
    const books = await db.all(
      `
      SELECT * FROM userBooks
      WHERE userName = ?
    `,
      [userName]
    )

    res.status(200).json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
