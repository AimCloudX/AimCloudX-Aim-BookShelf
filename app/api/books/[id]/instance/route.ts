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
      instances: {
        create: {
          purchaser: data.purchaser,
          purchaseAt: new Date(data.purchaseAt),
          location: data.location,
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
      message: `購入情報が追加されました (bookId: ${id})`,
      book: updatedBook,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
