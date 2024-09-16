import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

interface bookInterface {
  id: number | string
  name: string
  author: string
}

const bookStorage: bookInterface[] = [];

app.get('/', (c) => {
  return c.text('Hello Sammy!')
})
// get all books
const booksRouter = new Hono()

booksRouter.get('/', (c) => {
  return c.json(bookStorage)
})

// store the books
booksRouter.post('/', async (c) => {
  const book: bookInterface = await c.req.json()
  bookStorage.push(book)
  const response = {
    success: true,
    message: "Book added to storage successfully"
  }
  return c.json(response)
})

// update the books
booksRouter.put('/:id', async (c) => {
  const bookId = parseInt(c.req.param('id'))
  const { name, author} = await c.req.json()
  const book = bookStorage.find(book => book.id === bookId)

  if(!book) {
    const error = {
      success: false,
      message: "Book not found by given Id"
    }
    return c.json(error, 404)
  }

  // update the book
  book.name= name
  book.author= author

  // update the storage
  bookStorage [bookId] = book
  const response = {
    success: true,
    message: "Book updated successfully"
  }
  return c.json(response)
})
booksRouter.get('/:id', async (c) => {
  const bookId = parseInt(c.req.param('id'))

  // find the book
  const book = bookStorage.find(book => book.id === bookId)
  if(!book) {
    const error = {
      success: false,
      message: "Book not found by given Id"
    }
    return c.json(error, 404)
  }
  const response = {
    success: true,
    message: "Book found successfully",
    data: book
  }
  return c.json(response)
})
app.route('/api/books', booksRouter)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
