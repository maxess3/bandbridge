"use client";

import { DATA } from "../../app/data";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { IoMdMusicalNotes } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface BandTableProps {
  tableLayoutMode: "grid" | "list";
}

type Ads = {
  bandImage: string;
  bandName: string | null;
  genres: string[];
  bandSize: number;
  neededMusicians: string[];
  bandLevel: string;
  avgAge: number;
  location: string;
};

const createColumns = (tableLayoutMode: BandTableProps["tableLayoutMode"]) => {
  const columnHelper = createColumnHelper<Ads>();

  return [
    columnHelper.accessor("bandImage", {
      header: () => "",
      cell: () => (
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <IoMdMusicalNotes className="text-md" />
        </div>
      ),
    }),
    columnHelper.accessor("bandName", {
      header: () => "Nom",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("genres", {
      header: () => "Style",
      cell: (info) => info.getValue().join(", "),
    }),
    columnHelper.accessor("bandSize", {
      header: () => "Taille du groupe",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("neededMusicians", {
      header: () => "Recherche",
      cell: (info) => info.getValue().join(", "),
    }),
    columnHelper.accessor("bandLevel", {
      header: () =>
        tableLayoutMode === "grid" ? (
          "Niveau"
        ) : (
          <div className="flex items-center gap-x-2">
            Niveau
            <span className="flex flex-col -space-y-1">
              <IoChevronUp className="text-xs" />
              <IoChevronDown className="text-xs opacity-60" />
            </span>
          </div>
        ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("avgAge", {
      header: () =>
        tableLayoutMode === "grid" ? (
          "Âge moyen"
        ) : (
          <div className="flex items-center gap-x-2">
            Âge moyen{" "}
            <span className="flex flex-col -space-y-1">
              <IoChevronUp className="text-xs" />
              <IoChevronDown className="text-xs opacity-60" />
            </span>
          </div>
        ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("location", {
      header: () => "Localisation",
      cell: (info) => info.getValue(),
    }),
  ];
};

export default function BandTable({ tableLayoutMode }: BandTableProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(DATA);

  const columns = createColumns(tableLayoutMode);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (tableLayoutMode === "list") {
    return (
      <table className="w-full text-left border border-secondary">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-secondary">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="font-normal [&:not(:first-child):not(:last-child)]:px-3 [&:first-child]:rounded-tl-md [&:last-child]:rounded-tr-md py-1 px-4 border-2 border-transparent"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-secondary">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="[&:not(:first-child):not(:last-child)]:px-3 py-2 px-4"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (tableLayoutMode === "grid") {
    return (
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="bg-muted-background rounded-lg p-4 flex flex-col gap-y-2"
          >
            {row.getVisibleCells().map((cell) => (
              <div key={cell.id}>
                <div className="text-sm opacity-60">
                  {/* eslint-disable @typescript-eslint/no-explicit-any */}
                  {flexRender(
                    cell.column.columnDef.header,
                    cell.getContext() as any
                  )}
                </div>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
            <div className="flex gap-x-2 mt-4">
              <Button className="w-full font-semibold text-sm uppercase">
                Voir l'annonce
              </Button>
              <Button className="w-14 bg-transparent" variant="outline">
                <FaRegBookmark />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
