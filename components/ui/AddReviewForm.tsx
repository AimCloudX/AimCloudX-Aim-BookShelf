'use client'

import { useState } from 'react'
import axios from 'axios'
import clsx from 'clsx'

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
  const [reviewAt, setReviewAt] = useState('')

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
      setReviewAt('')
    } catch (err) {
      console.error(err)
      setError('レビューの追加に失敗しました。')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded-lg shadow-md w-full"
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
        <label className="block text-gray-700">レビュー日</label>
        <input
          type="date"
          value={reviewAt}
          onChange={(e) => setReviewAt(e.target.value)}
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
        className={clsx(
          "relative text-center mx-auto py-1 px-4 font-bold border-2 border-[#27acd9] text-[#27acd9] cursor-pointer overflow-hidden transition-colors duration-300 z-[1]",
          "before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-[#27acd9] before:-translate-x-full before:transition-transform before:duration-300 before:z-[-1]",
          "hover:text-white hover:before:translate-x-0"
        )}
      >
        追加する
      </button>

    </form>
    
  )
}
