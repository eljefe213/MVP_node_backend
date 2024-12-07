interface SearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label: string;
  }
  
  const SearchBar = ({ value, onChange, placeholder, label }: SearchBarProps) => {
    return (
      <div className="flex-1">
        <label htmlFor="search-input" className="sr-only">
          {label}
        </label>
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          aria-label={label}
        />
      </div>
    );
  };
  
  export default SearchBar;