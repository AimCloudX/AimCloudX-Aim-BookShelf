'use client'

import { useState, useEffect, useCallback, Key } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { Book } from '@/lib/book'
import { Toaster } from '@/components/ui/toaster'
import BookCard from '@/components/ui/book-card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SortAsc, SortDesc } from 'lucide-react'
import Loading from '@/components/ui/loading'

export default function Page() {
  const ITEMS_PER_PAGE = 12
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Book>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterLocation, setFilterLocation] = useState<
    'all' | 'bookshelf' | 'owner'
  >('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const fetchBooks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/books')
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      setError('Error fetching books. Please try again later.')
      console.error('Error fetching books:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteBook = useCallback(
    async (id: Key) => {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id))
          toast({
            title: 'Book deleted',
            description:
              'The book has been successfully removed from your library.',
          })
        } else {
          throw new Error('Failed to delete book')
        }
      } catch (error) {
        console.error('Error deleting book:', error)
        toast({
          title: 'Error',
          description: 'Failed to delete the book. Please try again.',
          variant: 'destructive',
        })
      }
    },
    [toast]
  )
  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  useEffect(() => {
    let result = [...books]

    if (filterLocation !== 'all') {
      result = result.filter((book) => book.location === filterLocation)
    }

    if (searchTerm) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.authors?.some((author) =>
            author.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [books, filterLocation, searchTerm, sortField, sortDirection])

  const pageCount = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)
  const displayedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Books</h1>
        <Button asChild className="mb-6">
          <Link href={'/search'}>検索画面へ</Link>
        </Button>
        {error && <div>Error: {error}</div>}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
          <Input
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={filterLocation}
            onValueChange={(value: 'all' | 'bookshelf' | 'owner') =>
              setFilterLocation(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="場所でフィルター" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全て</SelectItem>
              <SelectItem value="bookshelf">本棚</SelectItem>
              <SelectItem value="owner">所有者</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="isbn">ISBN</SelectItem>
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
        {books.length === 0 ? (
          <p>No books found in your library.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBooks.map((book) => (
              <BookCard key={book.id} book={book} deleteFunc={deleteBook} />
            ))}
          </div>
        )}
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
      <Toaster />
    </>
  )
}
