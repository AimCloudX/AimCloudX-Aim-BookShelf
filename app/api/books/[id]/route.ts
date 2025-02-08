import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const books = await prisma.book.findUnique({
      where: { id },
      include: {
        bookAuthors: {
          include: { author: true },
        },
        instances: true,
        reviews: true,
      },
    })
    return new Response(
      JSON.stringify(books),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: 'Error get book' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } finally {
    prisma.$disconnect()
  }
}

// TODO: 修正
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const bookWithAuthors = await prisma.book.findUnique({
      where: { id },
      include: {
        bookAuthors: {
          include: { author: true },
        },
      },
    })

    if (bookWithAuthors) {
      for (const author of bookWithAuthors.bookAuthors) {
        await prisma.author.delete({
          where: { id: author.author.id },
        })
      }

      const deletedBook = await prisma.book.delete({
        where: { id },
      })

      return new Response(
        JSON.stringify({
          message: `Book with ID ${id} and its authors deleted successfully.`,
          deletedBook,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else {
      return new Response(
        JSON.stringify({ error: `Book with ID ${id} not found.` }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: 'Error deleting book and authors' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } finally {
    prisma.$disconnect()
  }
}
