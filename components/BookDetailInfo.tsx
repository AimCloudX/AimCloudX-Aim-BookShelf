import { Book } from "@/lib/book"
import Image from "next/image"

export function BookDetailInfo ({book}:{book:Book}) {

    return(
        <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            {book.title}
            </h1>
            <div className="flex flex-col md:flex-row">
                {/* サムネイル画像 */}
                <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                    {/* 解像度最適化のためImageコンポーネント使用してみた。元画像が荒いから意味ないかも */}
                    <Image
                    src={book.thumbnail}
                    alt={book.title}
                    width={300}  // 幅の最大サイズを指定
                    height={450} // 高さの最大サイズを指定
                    // layout="responsive" // レスポンシブ対応
                    layout="intrinsic"  // 元の解像度を維持
                    className="rounded-lg shadow-md object-cover"
                    />
                </div>
                {/* 詳細情報 */}
                <div className="md:w-2/3 md:pl-8">
                <h2 className="text-2xl font-semibold">概要</h2>
                    <p className="text-gray-700 mb-4">{book.content}</p>
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold">ISBN</h2>
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold">ISBN10:</span> {book.isbn10}
                        </p>
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold">ISBN13:</span> {book.isbn13}
                        </p>
                    </div>

                    {/* 著者情報 */}
                    <section className="mb-6">
                    <h2 className="text-2xl font-semibold">著者</h2>
                    <ul className="list-disc list-inside">
                        {book.bookAuthors.map((bookAuthor, idx) => (
                        <li key={idx} className="text-gray-600">
                            {bookAuthor.author.name}
                        </li>
                        ))}
                    </ul>
                    </section>
                </div>
            </div>
        </div>
    )

}
