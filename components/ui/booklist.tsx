'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Grid, List, SortAsc, SortDesc } from 'lucide-react'
import { Book } from "@/lib/utils";

const ITEMS_PER_PAGE = 12

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Book>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterLocation, setFilterLocation] = useState<'all' | 'shelf' | 'owner'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
  }, [])

  useEffect(() => {
    let result = [...books]

    if (filterLocation !== 'all') {
      result = result.filter(book => book.location === filterLocation)
    }

    if (searchTerm) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors?.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    const compare = (a: Book, b: Book) => {
      const bookA = a[sortField]
      const bookB = b[sortField]
      if(bookA === undefined) return 0
      if(bookB === undefined) return 0
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

  const BookCard = ({ book }: { book: Book }) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{book.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{book.authors?.join(', ')}</p>
        <p className="text-sm mb-2">ISBN: {book.isbn}</p>
        <div className="flex justify-between items-center">
          <Badge variant={book.location === 'shelf' ? 'default' : 'secondary'}>
            {book.location === 'shelf' ? '本棚' : '所有者'}
          </Badge>
          <span className="text-sm text-muted-foreground">所有者ID: {book.ownerId}</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <Input
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filterLocation} onValueChange={(value: 'all' | 'shelf' | 'owner') => setFilterLocation(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="場所でフィルター" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全て</SelectItem>
            <SelectItem value="shelf">本棚</SelectItem>
            <SelectItem value="owner">所有者</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortField} onValueChange={(value: keyof Book) => setSortField(value)}>
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
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          {sortDirection === 'asc' ? <SortAsc /> : <SortDesc />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          {viewMode === 'grid' ? <List /> : <Grid />}
        </Button>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {displayedBooks.map((book) => (
          <Dialog key={book.id}>
            <DialogTrigger asChild>
              <div onClick={() => setSelectedBook(book)} className="cursor-pointer">
                {viewMode === 'grid' ? (
                  <BookCard book={book} />
                ) : (
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.authors?.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{book.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p><strong>著者:</strong> {book.authors?.join(', ')}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>場所:</strong> {book.location === 'shelf' ? '本棚' : '所有者'}</p>
                <p><strong>所有者ID:</strong> {book.ownerId}</p>
              </div>
            </DialogContent>
          </Dialog>
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