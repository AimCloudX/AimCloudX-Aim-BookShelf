import { Book } from "@/types";
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { SortAsc, SortDesc } from "lucide-react";


interface Props {
    filterStatus : string;
    setFilterStatus(status : string) : void;
    searchTerm : string;
    setSearchTerm(searchTerm : string) : void;
    sortField : keyof Book;
    setSortField(value: keyof Book) : void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: (sortOrder: 'asc' | 'desc') => void;
}


export function Filter (Props:Props) {

    return (
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <select
          value={Props.filterStatus}
          onChange={(e) => Props.setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">すべて</option>
          <option value="purchased">購入済み</option>
          <option value="reviewed">レビュー済み</option>
        </select>
          <Input
            placeholder="検索..."
            value={Props.searchTerm}
            onChange={(e) => Props.setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={Props.sortField}
            onValueChange={(value: keyof Book) => Props.setSortField(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ソート" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">タイトル</SelectItem>
              <SelectItem value="authors">著者</SelectItem>
              <SelectItem value="isbn10">ISBN10</SelectItem>
              <SelectItem value="isbn13">ISBN13</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              Props.setSortDirection(Props.sortDirection === 'asc' ? 'desc' : 'asc')
            }
          >
            {Props.sortDirection === 'asc' ? <SortAsc /> : <SortDesc />}
          </Button>
      </div>
    )
}