"use client";

import { DATA } from "../app/data";

import { useState } from "react";

import { IoMdMusicalNotes } from "react-icons/io";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Ads = {
  bandImage: string;
  bandName: string | null;
  genres: string[];
  bandSize: string[];
  neededMusicians: string[];
  bandLevel: string;
  avgAge: number;
  location: string;
};

const columnHelper = createColumnHelper<Ads>();

const columns = [
  columnHelper.accessor("bandImage", {
    header: () => "",
    cell: (info) => (
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
    header: () => "Genres",
    cell: (info) => info.getValue().join(", "),
  }),
  columnHelper.accessor("bandSize", {
    header: () => "Membres",
    cell: (info) => info.getValue().join(", "),
  }),
  columnHelper.accessor("neededMusicians", {
    header: () => "Recherche",
    cell: (info) => info.getValue().join(", "),
  }),
  columnHelper.accessor("bandLevel", {
    header: () => "Niveau",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("avgAge", {
    header: () => "Âge moyen",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("location", {
    header: () => "Localisation",
    cell: (info) => info.getValue(),
  }),
];

export default function BandTable() {
  const [data, setData] = useState(DATA);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="w-full text-left">
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
          <tr key={row.id} className="border-b border-accent">
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
