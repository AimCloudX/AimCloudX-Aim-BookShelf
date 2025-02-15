'use client'
import { FormEvent, useState } from 'react'
import axios from 'axios'
import { BookFromGoogle, Book, BookAuthor } from '@/lib/book'
import Image from 'next/image'
import { FetchBooks } from '@/lib/executeQuery'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const SearchPage = () => {
  const NO_AUTHORS = [new BookAuthor('no authors')]
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [books, setBooks] = useState<BookFromGoogle[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookFromGoogle | null>(null)
  const [reviewer, setReviewer] = useState('')
  const [comment, setComment] = useState('')

  const [showInstanceModal, setShowInstanceModal] = useState(false)
  const [purchaser, setPurchaser] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [location, setLocation] = useState('')

  const searchBooks = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try
    {
      const { books } = await FetchBooks(keyword)
      setBooks(books)
    }
    finally
    {
      setIsLoading(false)
    }
  }

  const openModal = (book: BookFromGoogle) => {
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
      content: selectedBook.volumeInfo.description || '',
      isbn10:
        selectedBook.volumeInfo.industryIdentifiers?.find(
          ({ type }: { type: string }) => type === 'ISBN_10'
        )?.identifier || '',
      isbn13:
        selectedBook.volumeInfo.industryIdentifiers?.find(
          ({ type }: { type: string }) => type === 'ISBN_13'
        )?.identifier || '',
      bookAuthors:
        selectedBook.volumeInfo.authors?.map((x) => new BookAuthor(x)) ??
        NO_AUTHORS,
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

  const openInstanceModal = (book: BookFromGoogle) => {
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
      content: selectedBook.volumeInfo.description || '',
      isbn10:
        selectedBook.volumeInfo.industryIdentifiers?.find(
          ({ type }: { type: string }) => type === 'ISBN_10'
        )?.identifier || '',
      isbn13:
        selectedBook.volumeInfo.industryIdentifiers?.find(
          ({ type }: { type: string }) => type === 'ISBN_13'
        )?.identifier || '',
      bookAuthors:
        selectedBook.volumeInfo.authors?.map((x) => new BookAuthor(x)) ??
        NO_AUTHORS,
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
      <form onSubmit={searchBooks}>
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder=""
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-grow"
            aria-label="Search query"
          />
          <Button disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              '検索'
            )}
          </Button>
        </div>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded">
            <Image
              src={
                book.volumeInfo.imageLinks?.thumbnail || '/default-image.jpg'
              }
              alt={book.volumeInfo.title}
              width={100}
              height={200}
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
