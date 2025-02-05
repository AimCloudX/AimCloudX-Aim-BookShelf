import { useState, useEffect, useCallback } from 'react';
import { Book, Instance, Review } from '../types';
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SortAsc, SortDesc } from 'lucide-react'

import axios from 'axios';
import { BookCard } from './BookCard';
import { Filter } from './Filter';

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
      <Filter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />

      <BookCard 
        filteredBooks={filteredBooks}
        filterStatus={filterStatus}
        getPurchaseInfo={getPurchaseInfo}
        getReviews={getReviews}
        instances={instances}
        reviews={reviews}
      />
    </div>
  );
};

export default MyBooksPage;