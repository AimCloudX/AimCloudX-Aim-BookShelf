'use client'

import { useState } from 'react'
import axios from 'axios'
import clsx from 'clsx'

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
      className="bg-gray-100 p-4 rounded-lg shadow-md w-full"
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
          className="mb-8 w-full border border-gray-300 rounded p-2"
          required
        />
      </div>
      <button
        type="submit"
        className={clsx(
          "text-center mx-auto py-1 px-4 font-bold border-2 border-[#27acd9] text-[#27acd9] cursor-pointer relative overflow-hidden transition-colors duration-300",
          "before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-[#27acd9] before:-translate-x-full before:transition-transform before:duration-300",
          "hover:text-white hover:before:translate-x-0"
        )}
      >
        追加する
      </button>
    </form>
  )
}
