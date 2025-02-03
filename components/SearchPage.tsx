'use client'
import { useState } from 'react'
import axios from 'axios'
import { BookFromGoogle, Book, BookInstance, Author } from '@/lib/book'

const SearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [books, setBooks] = useState<BookFromGoogle[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookFromGoogle | null>(null)
  const [reviewer, setReviewer] = useState('')
  const [comment, setComment] = useState('')

  const [showInstanceModal, setShowInstanceModal] = useState(false)
  const [purchaser, setPurchaser] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [location, setLocation] = useState('')

  const searchBooks = async () => {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${keyword}`
    )
    setBooks(response.data.items)
  }

  const openModal = (book: any) => {
    setSelectedBook(book)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setReviewer('')
    setComment('')
  }

  const saveComment = async () => {
    if (!selectedBook) return
    const book: Book = {
      id: '',
      bookId: selectedBook.id,
      title: selectedBook.volumeInfo.title,
      thumbnail: selectedBook.volumeInfo.imageLinks?.thumbnail || '',
      authors: selectedBook.volumeInfo.authors.map((x) => new Author(x)),
      content: selectedBook.volumeInfo.description || '',
      isbn10:
        selectedBook.volumeInfo.industryIdentifiers?.find(
          (id: any) => id.type === 'ISBN_10'
        )?.identifier || '',
      isbn13:
        selectedBook.volumeInfo.industryIdentifiers?.find(
          (id: any) => id.type === 'ISBN_13'
        )?.identifier || '',
      instances: [],
      reviews: [
        {
          bookId: selectedBook.id,
          reader: reviewer,
          content: comment,
        },
      ],
    }
    await axios.post('/api/books', book)
    closeModal()
  }

  const openInstanceModal = (book: any) => {
    setSelectedBook(book)
    setShowInstanceModal(true)
  }

  const closeInstanceModal = () => {
    setShowInstanceModal(false)
    setPurchaser('')
    setPurchaseDate('')
    setLocation('')
  }

  const saveInstance = async () => {
    if (!selectedBook) return

    const book: Book = {
      id: '',
      bookId: selectedBook.id,
      title: selectedBook.volumeInfo.title,
      thumbnail: selectedBook.volumeInfo.imageLinks?.thumbnail || '',
      authors: selectedBook.volumeInfo.authors.map((x) => new Author(x)),
      content: selectedBook.volumeInfo.description || '',
      isbn10:
        selectedBook.volumeInfo.industryIdentifiers?.find(
          (id: any) => id.type === 'ISBN_10'
        )?.identifier || '',
      isbn13:
        selectedBook.volumeInfo.industryIdentifiers?.find(
          (id: any) => id.type === 'ISBN_13'
        )?.identifier || '',
      instances: [
        {
          bookId: selectedBook.id,
          purchaser: purchaser,
          purchaseAt: new Date(purchaseDate + 'T00:00:00Z'),
          location: location,
        },
      ],
      reviews: [],
    }
    await axios.post('/api/books', book)
    closeInstanceModal()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">書籍検索</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={searchBooks}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          検索
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded">
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              className="w-32 mx-auto"
            />
            <h2 className="font-bold mt-2">{book.volumeInfo.title}</h2>
            <button
              onClick={() => openModal(book)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              コメント追加
            </button>
            <button
              onClick={() => openInstanceModal(book)}
              className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
            >
              購入報告
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold">
              {selectedBook.volumeInfo.title}
            </h2>
            <h2 className="text-xl mb-4">コメント追加</h2>
            <input
              type="text"
              placeholder="レビュアー名"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              placeholder="コメント"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                キャンセル
              </button>
              <button
                onClick={saveComment}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showInstanceModal && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold">
              {selectedBook.volumeInfo.title}
            </h2>
            <h2 className="text-xl mb-4">購入報告</h2>
            <input
              type="text"
              placeholder="購入者"
              value={purchaser}
              onChange={(e) => setPurchaser(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="場所"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeInstanceModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                キャンセル
              </button>
              <button
                onClick={saveInstance}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage
