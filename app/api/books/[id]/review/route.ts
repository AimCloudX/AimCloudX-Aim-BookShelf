import { PrismaClient } from '@prisma/client'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient()
  const { id } = params
  const data = await request.json()
  const updatedBook = await prisma.book.update({
    where: { id },
    data: {
      reviews: {
        create: {
          reader: data.reader,
          content: data.content,
        },
      },
    },
    include: {
      bookAuthors: {
        include: { author: true },
      },
      instances: true,
      reviews: true,
    },
  })
  return new Response(
    JSON.stringify({
      message: `レビューが追加されました (bookId: ${id})`,
      book: updatedBook,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
