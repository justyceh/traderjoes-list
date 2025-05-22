import { useEffect, useState } from 'react';

const SearchBar = ({ onSearch, value }) => {
  const [query, setQuery] = useState('');

    useEffect(() => {
        setQuery(value);
    }, [value]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSearch(query.trim());
    console.log(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="fixed top-19 left-0 right-0 bg-white z-50 shadow p-4 flex items-center justify-center">
      <input
        type="text"
        placeholder="Search for a product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded"
      />
      <button type="submit" className="ml-4 bg-rose-500 text-white px-4 py-2 rounded cursor-pointer">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
