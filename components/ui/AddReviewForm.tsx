'use client'

import { useState } from 'react'
import axios from 'axios'

interface AddReviewFormProps {
  bookId: string
  onSuccess: () => void
}

export default function AddReviewForm({
  bookId,
  onSuccess,
}: AddReviewFormProps) {
  const [reader, setReader] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post(`/api/books/${bookId}/review`, {
        reader,
        content,
      })
      setReader('')
      setContent('')
      onSuccess()
    } catch (err) {
      console.error(err)
      setError('レビューの追加に失敗しました。')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded-lg shadow-md mt-4"
    >
      <h3 className="text-lg font-semibold mb-2">レビューを追加</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-2">
        <label className="block text-gray-700">読者</label>
        <input
          type="text"
          value={reader}
          onChange={(e) => setReader(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        追加する
      </button>
    </form>
  )
}
