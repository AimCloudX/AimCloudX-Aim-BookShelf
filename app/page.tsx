'use client'
import { useState } from "react";
import SearchPage from "../components/SearchPage";
import MyBooksPage from "../components/My-books";

export default function Page() {
  // 現在選択されているタブを管理
  const [activeTab, setActiveTab] = useState("myBooks");

  // 各タブに対応するコンポーネント
  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchPage />;
      case "myBooks":
        return <MyBooksPage />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">書籍管理アプリ</h1>

      {/* タブナビゲーション */}
      <nav className="flex gap-4 mb-4">
        <button
          className={`text-blue-500 hover:underline ${
            activeTab === "myBooks" ? "font-bold underline" : ""
          }`}
          onClick={() => setActiveTab("myBooks")}
        >
          本棚
        </button>
        <button
          className={`text-blue-500 hover:underline ${
            activeTab === "search" ? "font-bold underline" : ""
          }`}
          onClick={() => setActiveTab("search")}
        >
          書籍検索
        </button>
      </nav>

      {/* タブに応じたコンテンツを表示 */}
      <div>{renderContent()}</div>
    </div>
  );
}