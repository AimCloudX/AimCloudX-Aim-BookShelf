'use server'
import isISBN from '@/lib/isbn'
import { BookFromGoogle } from '@/lib/book'
import axios from 'axios'

export async function FetchBooks (query?: string): Promise<{books: BookFromGoogle[]}> {
    if(!query?.trim()){
        return {books:[]}
    }

    try {
        const encodedQuery = encodeURIComponent(query)
        const baseURL = isISBN(query)
            ? 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
            : 'https://www.googleapis.com/books/v1/volumes?q='
        const response = await axios.get(baseURL + encodedQuery)
        const { items } = response.data
        return {books: items || []}
    } catch  {
        return {books:[]}
    }
} 
