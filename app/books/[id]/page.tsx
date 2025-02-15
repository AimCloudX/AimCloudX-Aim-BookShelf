import BookDetailActions from '@/components/ui/BookDetailActions'
import { Book } from '@/lib/book'
import axios from 'axios'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export default async function BookDetailPage(props: PageProps) {
  const { params } = props
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const { data } = await axios.get(`${baseUrl}/api/books/${params.id}`)
  const book = data as Book

  if (!book) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          {book.title}
        </h1>
        <div className="flex flex-col md:flex-row">
          {/* サムネイル画像 */}
          <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
            <img
              src={book.thumbnail}
              alt={book.title}
              className="rounded-lg shadow-md w-full h-64 object-cover"
            />
          </div>
          {/* 詳細情報 */}
          <div className="md:w-2/3 md:pl-8">
            <p className="text-gray-700 mb-4">{book.content}</p>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold">ISBN10:</span> {book.isbn10}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">ISBN13:</span> {book.isbn13}
              </p>
            </div>

            {/* 著者情報 */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                著者
              </h2>
              <ul className="list-disc list-inside">
                {book.bookAuthors.map((bookAuthor, idx) => (
                  <li key={idx} className="text-gray-600">
                    {bookAuthor.author.name}
                  </li>
                ))}
              </ul>
            </section>

            {/* 購入情報 */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                購入情報
              </h2>
              <ul className="list-disc list-inside">
                {book.instances.map((instance, idx) => (
                  <li key={idx} className="text-gray-600">
                    購入者: {instance.purchaser} | 購入日:{' '}
                    {new Date(instance.purchaseAt).toLocaleDateString()} | 場所:{' '}
                    {instance.location}
                  </li>
                ))}
              </ul>
            </section>

            {/* レビュー */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                レビュー
              </h2>
              <ul className="list-disc list-inside">
                {book.reviews.map((review, idx) => (
                  <li key={idx} className="text-gray-600">
                    <span className="font-bold">{review.reader}</span>:{' '}
                    {review.content}
                  </li>
                ))}
              </ul>
            </section>
            <section>
            <BookDetailActions bookId={book.id.toString()} />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
