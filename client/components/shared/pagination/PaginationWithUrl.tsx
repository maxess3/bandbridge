"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { generatePageNumbers } from "@/utils";

interface PaginationWithUrlProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  limit?: number;
  defaultLimit?: number;
  onPageChange: (page: number) => void;
  queryParams?: Record<string, string>;
}

export const PaginationWithUrl = ({
  basePath,
  currentPage,
  totalPages,
  limit,
  defaultLimit,
  onPageChange,
  queryParams = {},
}: PaginationWithUrlProps) => {
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Add query params (e.g., q for search)
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    // Add page
    params.set("page", page.toString());
    
    // Add limit only if provided and different from default
    if (limit !== undefined && defaultLimit !== undefined && limit !== defaultLimit) {
      params.set("limit", limit.toString());
    }
    
    return `${basePath}?${params.toString()}`;
  };

  const handlePrevious = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildPageUrl(Math.max(1, currentPage - 1))}
            onClick={handlePrevious}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href={buildPageUrl(pageNum)}
                onClick={(e) => handlePageClick(e, pageNum)}
                isActive={pageNum === currentPage}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={buildPageUrl(Math.min(totalPages, currentPage + 1))}
            onClick={handleNext}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
