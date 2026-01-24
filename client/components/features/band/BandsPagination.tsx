"use client";

import { PaginationWithUrl } from "@/components/shared/pagination";

interface BandsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const BandsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: BandsPaginationProps) => {
  return (
    <PaginationWithUrl
      basePath="/bands"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};
