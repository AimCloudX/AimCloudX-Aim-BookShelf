'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { SortAsc, SortDesc } from 'lucide-react'
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
import { Card, CardContent } from '@/components/ui/card'
import Loading from '@/components/ui/loading'
import Link from 'next/link'

const MyBooksPage = () => {
  const ITEMS_PER_PAGE = 12
  const [books, setBooks] = useState<Book[]>([])
  // Filter,sort関連
  const [filterStatus, setFilterStatus] = useState<
    'purchased' | 'reviewed' | 'all'
  >('all')
  const [sortField, setSortField] = useState<keyof Book>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('') //検索キーワード
  //本棚展開用変数
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const compare = (a: Book, b: Book) => {
    const bookA = a[sortField]
    const bookB = b[sortField]
    if (bookA < bookB) return sortDirection === 'asc' ? -1 : 1
    if (bookA > bookB) return sortDirection === 'asc' ? 1 : -1
    return 0
  }

  const fetchData = async () => {
    const response = await axios.get('/api/books')

    const books = response.data
    setBooks(books)
  }

  useEffect(() => {
    fetchData().finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    let result = [...books]

    if (searchTerm) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.bookAuthors?.some(({ author: { name } }) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    }

    result.sort(compare)

    setFilteredBooks(result)
  }, [books, filterStatus, searchTerm, sortField, sortDirection])

  const pageCount = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)
  const displayedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">本棚</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as 'purchased' | 'reviewed' | 'all')
          }
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
            <SelectItem value="bookAuthors">著者</SelectItem>
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
        {!!displayedBooks &&
          displayedBooks
            .filter((book) => {
              if (filterStatus === 'purchased') {
                return book.instances.length > 0
              }
              if (filterStatus === 'reviewed') {
                return book.reviews.length > 0
              }
              return true
            })
            .map((book, index) => (
              <Link key={index} href={'/books/' + book.id}>
                <Card
                  key={book.id}
                  className="border p-4 rounded cursor-pointer"
                >
                  <CardContent className="p-4">
                    <Image
                      src={book.thumbnail}
                      alt={book.title}
                      width={80}
                      height={120}
                      className="object-cover mr-4"
                    />
                  </CardContent>
                  <h2 className="font-bold mt-2">{book.title}</h2>
                  <p className="text-sm text-gray-600">isbn10: {book.isbn10}</p>
                  <p className="text-sm text-gray-600">isbn13: {book.isbn13}</p>
                  <p className="text-sm text-gray-600">
                    author:{' '}
                    {book.bookAuthors
                      .map(({ author: { name } }) => name)
                      .join(', ')}
                  </p>
                </Card>
              </Link>
            ))}
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default MyBooksPage
