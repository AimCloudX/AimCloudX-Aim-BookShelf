export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="spinner border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full mx-auto mb-6"></div>
        <p className="text-xl">ロード中...</p>
      </div>
    </div>
  )
}
