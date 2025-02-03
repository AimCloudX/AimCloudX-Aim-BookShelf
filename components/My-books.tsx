import { useState, useEffect } from 'react'
import axios from 'axios'
import { Book } from '@/lib/book'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SortAsc, SortDesc } from 'lucide-react'
const MyBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  // Filter,sort関連
  const [filterStatus, setFilterStatus] = useState<
    'purchased' | 'reviewed' | 'all'
  >('all')
  const [sortField, setSortField] = useState<keyof Book>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('') //検索キーワード
  //本棚展開用変数
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const response = await axios.get('/api/books')

    const books = response.data
    console.log(books)
    setBooks(books)
  }

  useEffect(() => {
    let result = [...books]

    if (searchTerm) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.bookAuthors?.some(({ author: { name } }) => name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
      )
    }
    const compare = (a: Book, b: Book) => {
      const bookA = a[sortField]
      const bookB = b[sortField]
      if (bookA < bookB) return sortDirection === 'asc' ? -1 : 1
      if (bookA > bookB) return sortDirection === 'asc' ? 1 : -1
      return 0
    }
    result.sort(compare)

    setFilteredBooks(result)
  }, [books, filterStatus, searchTerm, sortField, sortDirection])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">本棚</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'purchased' | 'reviewed' | 'all')}
          className="border p-2 rounded"
        >
          <option value="all">すべて</option>
          <option value="purchased">購入済み</option>
          <option value="reviewed">レビュー済み</option>
        </select>
        <Input
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={sortField}
          onValueChange={(value: keyof Book) => setSortField(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="ソート" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">タイトル</SelectItem>
            <SelectItem value="authors">著者</SelectItem>
            <SelectItem value="isbn10">ISBN10</SelectItem>
            <SelectItem value="isbn13">ISBN13</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
          }
        >
          {sortDirection === 'asc' ? <SortAsc /> : <SortDesc />}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {!!filteredBooks &&
          filteredBooks
            .filter((book) => {
              if (filterStatus === 'purchased') {
                return book.instances.length > 0
              }
              if (filterStatus === 'reviewed') {
                return book.reviews.length > 0
              }
              return true
            })
            .map((book) => (
              <div
                key={book.id}
                className="border p-4 rounded cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-32 mx-auto"
                />
                <h2 className="font-bold mt-2">{book.title}</h2>
                <p className="text-sm text-gray-600">
                  {book.bookAuthors
                    .map(({ author: { name } }) => name)
                    .join(', ')}
                </p>
              </div>
            ))}
      </div>

      {selectedBook && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold">{selectedBook.title}</h2>
            <p className="text-sm text-gray-600">
              {selectedBook.bookAuthors
                .map(({ author: { name } }) => name)
                .join(', ')}
            </p>
            <h3 className="mt-4 font-semibold">購入情報</h3>
            {selectedBook.instances.length > 0 ? (
              <ul>
                {selectedBook.instances.map((instance, index) => (
                  <li key={index}>
                    購入者: {instance.purchaser} -{' '}
                    {instance.purchaseAt.getDate()} - {instance.location}
                  </li>
                ))}
              </ul>
            ) : (
              <p>購入情報なし</p>
            )}
            <h3 className="mt-4 font-semibold">レビュー</h3>
            {selectedBook.reviews.length > 0 ? (
              <ul>
                {selectedBook.reviews.map((review, index) => (
                  <li key={index}>
                    {review.reader}: {review.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p>レビューなし</p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setSelectedBook(null)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBooksPage
