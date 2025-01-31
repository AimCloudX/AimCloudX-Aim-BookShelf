import { useCallback, key } from 'react';
import { useToast } from '@/hooks/use-toast'

const deleteBook = useCallback(
  async (id: Key) => {
    const { toast } = useToast()
    try {
      const response = await fetch(`http://localhost:3001/books/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        toast({
          title: "Book deleted",
          description:
            "The book has been successfully removed from your library.",
        });
      } else {
        throw new Error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: "Failed to delete the book. Please try again.",
        variant: "destructive",
      });
    }
  },
  [toast]
);

export default deleteBook;
