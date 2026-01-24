"use client";

import { PaginationWithUrl } from "@/components/shared/pagination";

interface MusiciansPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const MusiciansPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: MusiciansPaginationProps) => {
  return (
    <PaginationWithUrl
      basePath="/musicians"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};
