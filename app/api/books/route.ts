import { PrismaClient } from '@prisma/client';


export async function GET() {
  const prisma = new PrismaClient();
  try {
    const books = await prisma.book.findMany({
      include: {
        authors: true,
      },
    });
    return new Response(JSON.stringify(books), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
    catch (error) {
      new Response(JSON.stringify({ error: 'Error creating book' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  finally
  {
    prisma.$disconnect()
  }
}

export async function POST(request: Request)
{
  const prisma = new PrismaClient();

  try {
    const { title, isbn, thumbnail, location, authors } = await request.json();

    // 新しい本を作成
    const newBook = await prisma.book.create({
      data: {
        title,
        isbn,
        thumbnail,
        location,
        authors: {
          create: authors.map((author: string) => ({ name: author })),
        },
      },
    });

    return new Response(JSON.stringify(newBook), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error creating book' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  finally
  {
    prisma.$disconnect()
  }
}