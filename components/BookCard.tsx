import { Book, Instance, Review } from "@/types";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";



interface Props {
    filteredBooks : Book[];
    filterStatus : string;
    instances : Instance[];
    reviews : Review[];
    getPurchaseInfo : (bookId: string) => Instance[];
    getReviews : (bookId: string) => Review[];
}


export function BookCard (Props:Props) {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Props.filteredBooks
              .filter((book) => {
                if (Props.filterStatus === 'purchased') {
                  return Props.instances.some((instance) => instance.id === book.id);
                }
                if (Props.filterStatus === 'reviewed') {
                  return Props.reviews.some((review) => review.id === book.id);
                }
                return true;
              })
              .map((book) => (
                <Card
                  key={book.id} 
                  className="border p-4 rounded cursor-pointer" 
                  onClick={() => setSelectedBook(book)}
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
                    author: {book.authors.join(', ')}
                  </p>
                </Card>
              ))}
          
        
          {selectedBook && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-1/2">
                <h2 className="text-xl font-bold">{selectedBook.title}</h2>
                <p className="text-sm text-gray-600">{selectedBook.authors.join(', ')}</p>
                <h3 className="mt-4 font-semibold">購入情報</h3>
                {Props.getPurchaseInfo(selectedBook.id).length > 0 ? (
                  <ul>
                    {Props.getPurchaseInfo(selectedBook.id).map((instance, index) => (
                      <li key={index}>購入者: {instance.purchaser} - {instance.purchaseDate}</li>
                    ))}
                  </ul>
                ) : (
                  <p>購入情報なし</p>
                )}
                <h3 className="mt-4 font-semibold">レビュー</h3>
                {Props.getReviews(selectedBook.id).length > 0 ? (
                  <ul>
                    {Props.getReviews(selectedBook.id).map((review, index) => (
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
}