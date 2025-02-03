import { Book } from '@/lib/book'
import { Key } from 'react'
import { Card, CardContent, CardFooter } from './card'
import Image from 'next/image'
// import { Badge } from './badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'
import { Button } from './button'
import { Trash2 } from 'lucide-react'

const BookCard = ({
  book,
  deleteFunc,
}: {
  book: Book
  deleteFunc: (id: Key) => Promise<void>
}) => (
  <Card key={book.id} className="h-full">
    <CardContent className="p-4">
      <div className="flex items-center mb-4">
        <Image
          src={book.thumbnail || '/placeholder.png'}
          alt={book.title}
          width={80}
          height={120}
          className="object-cover mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <p className="text-gray-600">
            {book.bookAuthors?.map(({ author: { name } }) => name).join(', ')}
          </p>
          <p className="text-gray-500">{book.isbn13}</p>
        </div>
      </div>
      {/* TODO: 仕様変更に伴って、Viewも変える
      <div className="flex justify-between items-center">
        <Badge
          variant={book.location === 'bookshelf' ? 'default' : 'secondary'}
        >
          {book.location === 'bookshelf' ? '本棚' : '所有者'}
        </Badge>
        {book.ownerId && (
          <span className="text-sm text-muted-foreground">
            所有者ID: {book.ownerId?.toString()}
          </span>
        )}
      </div> */}
    </CardContent>
    <CardFooter>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="mt-4">
            <Trash2 className="mr-2 h-4 w-4" />
            削除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。本当に {book.title} を削除しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteFunc(book.id)}>
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardFooter>
  </Card>
)

export default BookCard
