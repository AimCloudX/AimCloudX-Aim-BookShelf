import { NextResponse } from 'next/server';
import FetchBooks from '../../search/executeQuery';

export async function GET(request: Request) {
    // urlオブジェクトでurlを解析
    const url = new URL(request.url)
    // queryパラメータを取得
    const query = url.searchParams.get('query') || ''

    const result = await FetchBooks(query)
    return NextResponse.json(result)
}
