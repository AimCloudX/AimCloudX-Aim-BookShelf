import { Key } from 'react'

export interface Book {
  id: Key
  bookId: string
  title: string
  thumbnail: string
  content: string
  isbn10: string
  isbn13: string
  bookAuthors: BookAuthor[]
  instances: BookInstance[]
  reviews: Review[]
}

export class Author {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export class BookAuthor {
  bookId: string;
  authorId: string;
  author: Author;

  constructor(authorName: string) {
    this.bookId = '';
    this.authorId = '';
    this.author = new Author(authorName);
  }
}

export interface BookFromGoogle {
  id: string
  volumeInfo: {
    title: string
    authors: string[]
    publishedDate: string
    industryIdentifiers: { type: string; identifier: string }[]
    imageLinks?: { thumbnail: string }
    description: string
    publisher: string
  }
}

export interface BookInstance {
  bookId: Key
  purchaser: string
  purchaseAt: Date
  location: string
}

export interface Review {
  bookId: Key
  reader: string
  content: string
}
