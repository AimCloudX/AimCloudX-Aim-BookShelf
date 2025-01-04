import { NextResponse } from 'next/server'
import FetchBooks from '../../executeQuery'

export async function POST(request: Request) {
    const body = await request.json()
    const result = await FetchBooks(body)
    return NextResponse.json(result)
}
