import { useState } from 'react';
import axios from 'axios';
import { Review } from '../types';

interface Props {
  bookId: string;
  onClose: () => void;
}

const AddReviewModal: React.FC<Props> = ({ bookId, onClose }) => {
  const [review, setReview] = useState('');
  const [reader, setReader] = useState('');

  const handleSubmit = async () => {
    const reviewData: Review = {
      id: bookId,
      reader,
      review,
    };

    await axios.post('http://localhost:3001/reviews', reviewData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">感想を追加</h2>
        <input
          type="text"
          placeholder="読んだ人"
          value={reader}
          onChange={(e) => setReader(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="感想"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;