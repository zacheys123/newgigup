// components/dashboard/SearchFilters.tsx
"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function SearchFilters({
  locations,
  categories,
}: {
  locations: string[];
  categories: string[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const params = new URLSearchParams(searchParams);

    params.set("search", formData.get("search") as string);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-6 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          name="search"
          placeholder="Search gigs..."
          defaultValue={searchParams.get("search") || ""}
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
          onChange={(e) => handleFilter("location", e.target.value)}
          defaultValue={searchParams.get("location") || ""}
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
          onChange={(e) => handleFilter("category", e.target.value)}
          defaultValue={searchParams.get("category") || ""}
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
          onClick={() => router.replace(pathname)}
          className="text-gray-300 hover:text-white ml-auto"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
