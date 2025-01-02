import isISBN from '@/lib/isbn'
import { BookFromGoogle } from '@/lib/book'

export interface FetchBooksResult {
    books?: BookFromGoogle[]
    error?: {
        title: string
        description: string
    }
}

async function FetchBooks (query: string): Promise<FetchBooksResult> {
    if(!query.trim()){
        return {
            error: {
                title: 'Search Book Error',
                description: '検索条件を入力してください',
            }
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
        return {books: data.items || []}
    } catch  {
        return {
            error: {
                title: 'Search Book Error',
                description: '検索中にエラーが発生しました。もう一度お試しください。',
            }
        }
    }
//clientでsetError setIsLoading setBooks toast を変更
} 

export default FetchBooks;