'use client'

import { FormEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { BookFromGoogle } from '@/lib/book'


interface FetchProps {
    FetchBooks: (query?: string) => Promise<{books: BookFromGoogle[]} | {error: string}>;
}

export function SearchClient({FetchBooks}: FetchProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>('')
    const [query, setQuery] = useState('')
    const [searchedBooks, setSearchedBooks] = useState<BookFromGoogle[]>([])
    const [selectedBook, setSelectedBook] = useState<BookFromGoogle | null>()
    const [location, setLocation] = useState('')
    const [ownerId, setOwnerId] = useState('')


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        // hadlesubumit止めてserver actionを使用する方法もある
        try {
            const data = await FetchBooks(query)
            if('books' in data) {
                setSearchedBooks(data.books)
            } else {
                setError(data.error)
                toast({
                    title: 'Search Book Error',
                    description: data.error,
                })
            }
        } catch {
            setError('Failed to search books')
        } finally {
            setIsLoading(false)
        }
    }

    // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     setQuery(e.target.value)
    // }

    const addBook = async () => {
        if(!selectedBook || !location) {
            toast({
                title: 'Add Book Error',
                description: '本の場所を選択してください',
            })
            return
        }

        const bookData = {
            title: selectedBook.volumeInfo.title,
            authors: selectedBook.volumeInfo.authors,
            isbn: selectedBook.volumeInfo.industryIdentifiers?.find(
                (id) => id.type === 'ISBN_13'
            )?.identifier || '',
            thumbnail: selectedBook.volumeInfo.imageLinks?.thumbnail || '',
            location,
            ownerId: ownerId.trim() || null,
        }
      
        setIsLoading(true)
        try {
        const response = await fetch('/api/addBook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        })
        if (!response.ok) {
            throw new Error('Failed to add book')
        }
        setSelectedBook(null)
        setLocation('')
        setOwnerId('')
        toast({
            title: 'Book Added',
            description: '本が正常に追加されました',
        })
        } catch {
        toast({
            title: 'Add Book Error',
            description: '本の追加中にエラーが発生しました。もう一度お試しください。',
        })
        } finally {
        setIsLoading(false)
        }

    }

    return (
        <>
            <Button asChild className="mb-4">
                <Link href={'/'}>トップ画面へ</Link>
            </Button>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-6">
                <Input
                    type="text"
                    placeholder="Enter title or ISBN"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow"
                    aria-label="Search query"
                />
                <Button disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        'Search'
                    )}
                    </Button>
                </div>
                </form>
                {error && (
                <p className="text-red-500 mb-4" role="alert">
                    {error}
                </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchedBooks.map((book) => {
                    return (
                    <Card key={book.id}>
                        <CardContent className="p-4">
                        <div className="flex items-center mb-4">
                            <Image
                            src={
                                book.volumeInfo.imageLinks?.thumbnail ||
                                '/placeholder.png'
                            }
                            alt={book.volumeInfo.title}
                            width={80}
                            height={120}
                            className="object-cover mr-4"
                            />
                            <div>
                            <h2 className="text-xl font-semibold">
                                {book.volumeInfo.title}
                            </h2>
                            <p className="text-gray-600">
                                {book.volumeInfo.authors?.join(', ')}
                            </p>
                            <p className="text-gray-500">
                                {book.volumeInfo.publishedDate}
                            </p>
                            </div>
                        </div>
                        <Button onClick={() => setSelectedBook(book)}>Select</Button>
                        </CardContent>
                    </Card>
                    )
                })}
                </div>
                <Dialog
                open={!!selectedBook}
                onOpenChange={() => setSelectedBook(null)}
                >
                <DialogContent className="max-h-[80vh] flex flex-col">
                    <DialogHeader>
                    <DialogTitle>{selectedBook?.volumeInfo.title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-y-auto pr-4">
                    <div className="space-y-4">
                        <Image
                        src={
                            selectedBook?.volumeInfo.imageLinks?.thumbnail ||
                            '/placeholder.png'
                        }
                        alt={selectedBook?.volumeInfo.title || ''}
                        width={200}
                        height={300}
                        className="object-cover mx-auto"
                        />
                        <p>
                        <strong>ISBN:</strong>{' '}
                        {
                            selectedBook?.volumeInfo.industryIdentifiers?.find(
                            (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
                            )?.identifier
                        }
                        </p>
                        <p>
                        <strong>Authors:</strong>{' '}
                        {selectedBook?.volumeInfo.authors?.join(', ')}
                        </p>
                        <p>
                        <strong>Published:</strong>{' '}
                        {selectedBook?.volumeInfo.publishedDate}
                        </p>
                        <p>
                        <strong>Publisher:</strong>{' '}
                        {selectedBook?.volumeInfo.publisher}
                        </p>
                        <p>
                        <strong>Description:</strong>{' '}
                        {selectedBook?.volumeInfo.description}
                        </p>
                    </div>
                    </div>
                    <div className="mt-4 space-y-4">
                    <Input
                        type="text"
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        className="flex-grow"
                        placeholder="Owner ID (optional)"
                        aria-label="Owner ID"
                    />
                    <Select onValueChange={setLocation}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="bookshelf">本棚</SelectItem>
                        <SelectItem value="owner">所有者</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <DialogFooter className="mt-4">
                    <Button onClick={() => setSelectedBook(null)}>Cancel</Button>
                    <Button onClick={addBook} disabled={isLoading}>
                        {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                        'Add Book'
                        )}
                    </Button>
                    </DialogFooter>
                </DialogContent>
                </Dialog>
            <Toaster />
        </>
    )
}
