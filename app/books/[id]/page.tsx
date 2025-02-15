import { BookDetailInfo } from '@/components/BookDetailInfo'
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
        <BookDetailInfo book={book}/>

        {/* 購入情報 */}
        <section className="mb-6 mt-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            購入情報
          </h2>
          <ul className="list-disc list-inside h-[100px] overflow-y-scroll overflow-hidden border-2 rounded p-2">
            {book.instances
              // 降順
              .sort((instanceA, instanceB) => new Date(instanceB.purchaseAt).getTime() - new Date(instanceA.purchaseAt).getTime())
              .map((instance, idx) => (
                <li key={idx} className="text-gray-600">
                  <span className='inline-block w-[200px]'>
                    <span className='font-bold'>購入日:{' '}</span>{new Date(instance.purchaseAt).toLocaleDateString()}
                  </span>
                  <span className='inline-block w-[200px] h-[20px] overflow-hidden text-ellipsis white-space-nowrap'>
                    <span className='font-bold'>購入者:{' '}</span>
                    {instance.purchaser.length > 10 ? instance.purchaser.substring(0, 10) + '...' : instance.purchaser}
                  </span>
                  <span className='inline-block w-[300px]'>
                    <span className='font-bold'>場所:{' '}</span>
                    {instance.location.length > 20 ? instance.location.substring(0, 20) + '...' : instance.location}
                  </span>              
                </li>
              ))}
          </ul>
        </section>

        {/* レビュー */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            レビュー
          </h2>
          <ul className="list-disc list-inside h-[100px] overflow-hidden overflow-y-scroll border-2 rounded p-2">
            {book.reviews
              // 降順
              .sort((reviewA, reviewB) => new Date(reviewB.reviewAt).getTime() - new Date(reviewA.reviewAt).getTime())
              .map((review, idx) => (
                <li key={idx} className="text-gray-600">
                  <span className='inline-block w-[200px]'>    
                    <span className='font-bold'>レビュー日:{' '}</span>
                    {new Date(review.reviewAt).toLocaleDateString()}
                  </span> 
                  <span className='inline-block w-[200px]'>
                    <span className="font-bold">読者:{' '}</span>
                    {review.reader.length > 20 ? review.reader.substring(0, 20) + '...' : review.reader}
                  </span>
                  <span className='inline-block w-[400px]'>
                    <span className='font-bold'>内容:{' '}</span>
                    {review.content.length > 20 ? review.content.substring(0, 30) + '...' : review.content}
                  </span>
                </li>
              ))}
          </ul>
        </section>
        <section className='mt-10'>
        <BookDetailActions bookId={book.id.toString()} />
        </section>
      </div>
    </div>
  )
}
