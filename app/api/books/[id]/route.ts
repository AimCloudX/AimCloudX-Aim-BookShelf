// app/api/books/[id]/route.ts
import { PrismaClient } from '@prisma/client';


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const prisma = new PrismaClient();
  const { id } = params; 
  try {
    // TODO: authorがDBに残ってしまう
    const deletedBook = await prisma.book.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: `Book with ID ${id} deleted successfully.`, deletedBook }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error deleting book' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  finally
  {
    prisma.$disconnect()
  }
}
