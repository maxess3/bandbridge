"use client";

import { DATA } from "../app/data";

import { useState } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Ads = {
  bandName: string | null;
  genres: string[];
  bandSize: string[];
  neededMusicians: string[];
  avgAge: number;
  location: string;
};

const columnHelper = createColumnHelper<Ads>();

const columns = [
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
  columnHelper.accessor("avgAge", {
    header: () => "Age moyen",
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
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="px-3">
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
          <tr key={row.id} className="border border-accent">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-3">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
