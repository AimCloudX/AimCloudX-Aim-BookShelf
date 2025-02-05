import { useState, useEffect, useCallback } from 'react';
import { Book, Instance, Review } from '../types';
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SortAsc, SortDesc } from 'lucide-react'

import axios from 'axios';

const MyBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Filter,sort関連
  const [filterStatus, setFilterStatus] = useState('all'); //purchased or reviewed or all
  const [sortField, setSortField] = useState<keyof Book>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('') //検索キーワード
  //本棚展開用変数
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    const [booksRes, instancesRes, reviewsRes] = await Promise.all([
      axios.get('http://localhost:3001/books'),
      axios.get('http://localhost:3001/instances'),
      axios.get('http://localhost:3001/reviews'),
    ]);

    setBooks(booksRes.data);
    setInstances(instancesRes.data);
    setReviews(reviewsRes.data);
  }, []);


  useEffect(() => {
    let result = [...books]

    if (searchTerm) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.authors?.some((author) =>
            author.toLowerCase().includes(searchTerm.toLowerCase())
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

  //modalで使用
  const getPurchaseInfo = (bookId: string) => {
    return instances.filter(instance => instance.id === bookId);
  };

  const getReviews = (bookId: string) => {
    return reviews.filter(review => review.id === bookId);
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">本棚</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
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
        {filteredBooks
          .filter((book) => {
            if (filterStatus === 'purchased') {
              return instances.some((instance) => instance.id === book.id);
            }
            if (filterStatus === 'reviewed') {
              return reviews.some((review) => review.id === book.id);
            }
            return true;
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
                {book.authors.join(', ')}
              </p>
            </div>
          ))}
      </div>
    
      {selectedBook && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold">{selectedBook.title}</h2>
            <p className="text-sm text-gray-600">{selectedBook.authors.join(', ')}</p>
            <h3 className="mt-4 font-semibold">購入情報</h3>
            {getPurchaseInfo(selectedBook.id).length > 0 ? (
              <ul>
                {getPurchaseInfo(selectedBook.id).map((instance, index) => (
                  <li key={index}>購入者: {instance.purchaser} - {instance.purchaseDate}</li>
                ))}
              </ul>
            ) : (
              <p>購入情報なし</p>
            )}
            <h3 className="mt-4 font-semibold">レビュー</h3>
            {getReviews(selectedBook.id).length > 0 ? (
              <ul>
                {getReviews(selectedBook.id).map((review, index) => (
                  <li key={index}>{review.reviewer}: {review.comment}</li>
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
  );
};

export default MyBooksPage;