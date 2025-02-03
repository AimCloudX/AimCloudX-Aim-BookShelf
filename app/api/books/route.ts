import { Author } from '@/lib/book'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient()
  try {
    const books = await prisma.book.findMany({
      include: {
        authors: true,
        instances: true,
        reviews: true,
      },
    })
    return new Response(JSON.stringify(books), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    new Response(JSON.stringify({ error: 'Error creating book' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  } finally {
    prisma.$disconnect()
  }
}

export async function POST(req: Request) {
  const prisma = new PrismaClient()

  try {
    const {
      bookId,
      title,
      thumbnail,
      authors,
      content,
      isbn10,
      isbn13,
      instances,
      reviews,
    } = await req.json()

    const existingBook = await prisma.book.findUnique({
      where: { bookId },
    })

    if (!existingBook) {
      // 新しい本を作成
      const newBook = await prisma.book.create({
        data: {
          bookId,
          title,
          thumbnail,
          authors: {
            create: authors.map((author: Author) => ({ name: author.name })),
          },
          content,
          isbn10,
          isbn13,
          instances: {
            create: instances.map(
              (instance: {
                purchaser: string
                purchaseAt: string
                location: string
              }) => ({
                purchaser: instance.purchaser,
                purchaseAt: new Date(instance.purchaseAt),
                location: instance.location,
              })
            ),
          },
          reviews: {
            create: reviews.map(
              (review: { reader: string; content: string }) => ({
                reader: review.reader,
                content: review.content,
              })
            ),
          },
        },
        include: {
          authors: true,
          instances: true,
          reviews: true,
        },
      })
      console.log(newBook)
      return new Response(JSON.stringify(newBook), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      const updatedBook = await prisma.book.update({
        where: { bookId: existingBook.bookId },
        data: {
          instances: {
            create: instances.map((instance: { purchaser: string; purchaseAt: string; location: string }) => ({
              purchaser: instance.purchaser,
              purchaseAt: new Date(instance.purchaseAt),
              location: instance.location,
            })),
          },
          reviews: {
            create: reviews.map((review: { reader: string; content: string }) => ({
              reader: review.reader,
              content: review.content,
            })),
          },
        },
        include: {
          authors: true,
          instances: true,
          reviews: true,
        },
      });
      console.log(updatedBook)
      return new Response(JSON.stringify(updatedBook), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Error creating book' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  } finally {
    prisma.$disconnect()
  }
}
