import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { mockUniversities } from '../../lib/mockData';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  dark?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className, 
  placeholder = 'Search by university, city, or neighborhood...', 
  dark = false 
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Popular searches
  const popularSearches = ['Berkeley, CA', 'NYU', 'Stanford University', 'Boston University', 'Austin, TX'];

  useEffect(() => {
    if (query.length > 1) {
      // Filter universities and popular searches based on query
      const universityMatches = mockUniversities
        .filter(uni => (uni.name?.toLowerCase().includes(query.toLowerCase()) ||
                        uni.location?.toLowerCase().includes(query.toLowerCase())))
        .map(uni => `${uni.name}${uni.location ? ', ' + uni.location : ''}`);
      
      const popularMatches = popularSearches.filter(search => 
        search.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions([...new Set([...universityMatches, ...popularMatches])]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div 
      ref={searchRef}
      className={cn(
        'relative w-full max-w-3xl',
        className
      )}
    >
      <div className={cn(
        'flex items-center rounded-full border bg-white shadow-sm transition-all duration-300 focus-within:shadow-md dark:bg-gray-800',
        dark ? 'border-gray-700' : 'border-gray-300'
      )}>
        <div className="pl-4">
          <MapPin className={cn(
            'h-5 w-5',
            dark ? 'text-gray-400' : 'text-gray-500'
          )} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-3 text-gray-900 placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-400"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="pr-2"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          className="flex h-full items-center rounded-r-full bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
          <span className="ml-2 hidden md:inline">Search</span>
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-60 overflow-y-auto rounded-md bg-white py-2 shadow-lg dark:bg-gray-800">
          {suggestions.length ? (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex w-full items-center px-4 py-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <MapPin className="mr-2 h-4 w-4 text-primary-500" />
                {suggestion}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;