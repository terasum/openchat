import { IconX } from "@tabler/icons-react";
import { FC } from "react";
import { Input } from "@/components/ui";

interface Props {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
}

export const Search: FC<Props> = ({ searchTerm, onSearch }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch("");
  };

  return (
    <div className="relative flex items-center">
      <div className="flex w-full items-center">
        <Input
          className="bg-white"
          type="text"
          placeholder="搜索会话"
          value={searchTerm}
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          onChange={handleSearchChange}
        />
      </div>

      {searchTerm && (
        <IconX
          className="absolute right-4 top-[10px] cursor-pointer text-neutral-300 hover:text-neutral-400"
          size={18}
          onClick={clearSearch}
        />
      )}
    </div>
  );
};
