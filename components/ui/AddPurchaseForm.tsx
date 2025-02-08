'use client'

import { useState } from 'react'
import axios from 'axios'

interface AddPurchaseFormProps {
  bookId: string
  onSuccess: () => void
}

export default function AddPurchaseForm({
  bookId,
  onSuccess,
}: AddPurchaseFormProps) {
  const [purchaser, setPurchaser] = useState('')
  const [purchaseAt, setPurchaseAt] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post(`/api/books/${bookId}/instance`, {
        purchaser,
        purchaseAt,
        location,
      })
      // フォームをリセット
      setPurchaser('')
      setPurchaseAt('')
      setLocation('')
      onSuccess()
    } catch (err) {
      console.error(err)
      setError('購入情報の追加に失敗しました。')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold mb-2">購入情報を追加</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-2">
        <label className="block text-gray-700">購入者</label>
        <input
          type="text"
          value={purchaser}
          onChange={(e) => setPurchaser(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">購入日</label>
        <input
          type="date"
          value={purchaseAt}
          onChange={(e) => setPurchaseAt(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">場所</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        追加する
      </button>
    </form>
  )
}
