import { Key } from 'react'

export interface Book {
  id: Key
  bookId: string
  title: string
  authors: Author[]
  thumbnail: string
  content: string
  isbn10: string
  isbn13: string
  instances: BookInstance[]
  reviews: Review[]
}

export interface Author {
  name: string
}

export class Author implements Author {
  constructor(name: string) {
    this.name = name
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
