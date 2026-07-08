import React from "react";
import { Search } from "lucide-react";
import Input from "./Input";

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-muted" />
      </div>
      <Input type="search" placeholder={placeholder} onKeyDown={handleKeyDown} className="pl-10" />
    </div>
  );
};

export default SearchBar;
