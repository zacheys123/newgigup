"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface SearchFiltersProps {
  locations: string[];
  categories: string[];
  onFilterChange: (filters: {
    search?: string;
    location?: string;
    category?: string;
  }) => void;
  initialValues: {
    search: string;
    location: string;
    category: string;
  };
}

export default function SearchFilters({
  locations,
  categories,
  onFilterChange,
  initialValues,
}: SearchFiltersProps) {
  const [searchValue, setSearchValue] = useState(initialValues.search);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchValue });
  };

  const handleFilterChange = (name: string, value: string) => {
    onFilterChange({ [name]: value });
  };

  const handleClearFilters = () => {
    setSearchValue("");
    router.replace(pathname);
  };

  return (
    <div className="mb-6 space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          name="search"
          placeholder="Search gigs..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-4">
        <select
          onChange={(e) => handleFilterChange("location", e.target.value)}
          value={initialValues.location}
          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => handleFilterChange("category", e.target.value)}
          value={initialValues.category}
          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={handleClearFilters}
          className="text-gray-300 hover:text-white ml-auto"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
