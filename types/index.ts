export interface Book {
  id: string;
  title: string;
  thumbnail: string;
  authors: string[];
  content: string;
  isbn10: string;
  isbn13: string;
}

export interface Instance {
  id: string;
  purchaser: string;
  purchaseDate: string;
  location: string;
}

export interface Review {
  id: string;
  reviewer: string;
  comment: string;
}