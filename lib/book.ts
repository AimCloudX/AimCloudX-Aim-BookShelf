import { Key } from 'react'

export interface Book {
  id: Key
  title: string
  authors: string[]
  isbn: string
  thumbnail: string
  location: string
  ownerId: string
}
