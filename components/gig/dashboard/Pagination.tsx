// components/Pagination.tsx
"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center mt-8 gap-2">
      <Link
        href={createPageURL(Math.max(1, currentPage - 1))}
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum =
          currentPage <= 3 ? i + 1 : Math.min(currentPage + i - 2, totalPages);

        if (pageNum < 1 || pageNum > totalPages) return null;

        return (
          <Link
            key={pageNum}
            href={createPageURL(pageNum)}
            className={`px-4 py-2 rounded-md ${
              currentPage === pageNum
                ? "bg-amber-500 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {pageNum}
          </Link>
        );
      })}

      <Link
        href={createPageURL(Math.min(totalPages, currentPage + 1))}
        className={`px-4 py-2 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </div>
  );
}
