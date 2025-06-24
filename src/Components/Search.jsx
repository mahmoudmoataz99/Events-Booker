import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Search() {
 const [query, setQuery] = useState('');
 const navigate = useNavigate();

 const handleSubmit = (e) => {
  e.preventDefault();
  if (query.trim()) {
   navigate(`/search?q=${encodeURIComponent(query)}`);
  }
 };

 return (
  <form onSubmit={handleSubmit} className="bg-gray-100 rounded-xl lg:mx-20 my-4 px-4 flex justify-between items-center">
   <input type="search" className="w-full p-2 rounded-lg focus:outline-none"
    placeholder="Search 4 Events" value={query} onChange={(e) => setQuery(e.target.value)} />
   <button type="submit" className="ml-2 p-2 text-xl text-gray-600 hover:text-purple-600 focus:outline-none">
    <FaSearch />
   </button>
  </form>
 );
}

export default Search;
