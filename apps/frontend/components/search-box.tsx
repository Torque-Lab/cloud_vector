import { useEffect, useRef } from "react";
import { Search } from "lucide-react"; 
import { Input } from "./ui/input";

interface SearchBoxProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (term: string) => void;
}


export function SearchBox({ searchTerm, setSearchTerm, onSearch }: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex items-center space-x-2 group relative">
      <Search className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />

      <Input
        ref={inputRef}
        placeholder="Search invoices..."
        className="w-64 pl-10" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
}
