"use client";

import { useRouter } from "next/navigation";
import AddPurchaseForm from "./AddPurchaseForm";
import AddReviewForm from "./AddReviewForm";

interface BookDetailActionsProps {
  bookId: string;
}

export default function BookDetailActions({ bookId }: BookDetailActionsProps) {
  const router = useRouter();
  // 登録成功時にページをリフレッシュ（最新情報を取得）
  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <div className="mt-8 space-x-8 flex justify-center mt-[10px]">
      <AddPurchaseForm bookId={bookId} onSuccess={handleSuccess} />
      <AddReviewForm bookId={bookId} onSuccess={handleSuccess} />
    </div>
  );
}