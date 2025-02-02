import { Key } from 'react'

export interface Book {
  id: Key
  title: string
  authors: Author[]
  isbn: string
  thumbnail: string
  location: string
  ownerId: string
}

export interface Author {
  name: string
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