'use server'

import isISBN from '@/lib/isbn'
import { BookFromGoogle } from '@/lib/book'

export async function FetchBooks (query?: string): Promise<{books: BookFromGoogle[]} | {error: string}> {
    if(!query?.trim()){
        return {
            error: '検索条件を入力してください',
        }
    }

    try {
        const encodedQuery = encodeURIComponent(query)
        const baseURL = isISBN(query)
            ? 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
            : 'https://www.googleapis.com/books/v1/volumes?q='
        const response = await fetch(baseURL + encodedQuery)
        if (!response.ok) {
            throw new Error('API request failed')
        }
        const data = await response.json()
        console.log('success')
        return {books: data.items || []}
    } catch  {
        console.log('server error')
        return {
            error: '検索中にエラーが発生しました。もう一度お試しください。',
        }
    }
//clientでsetError setIsLoading setBooks toast を変更
} 
