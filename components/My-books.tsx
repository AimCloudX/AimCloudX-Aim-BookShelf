import { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Instance, Review } from '../types';

const MyBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState('all');
   const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [booksRes, instancesRes, reviewsRes] = await Promise.all([
      axios.get('http://localhost:3001/books'),
      axios.get('http://localhost:3001/instances'),
      axios.get('http://localhost:3001/reviews'),
    ]);

    setBooks(booksRes.data);
    setInstances(instancesRes.data);
    setReviews(reviewsRes.data);
  };

const getPurchaseInfo = (bookId: string) => {
    return instances.filter(instance => instance.id === bookId);
  };

  const getReviews = (bookId: string) => {
    return reviews.filter(review => review.id === bookId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">本棚</h1>
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">すべて</option>
          <option value="purchased">購入済み</option>
          <option value="reviewed">レビュー済み</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {books
          .filter((book) => {
            if (filter === 'purchased') {
              return instances.some((instance) => instance.id === book.id);
            }
            if (filter === 'reviewed') {
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