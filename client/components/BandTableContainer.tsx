"use client";

import BandTableTop from "@/components/BandTableTop";
import BandTable from "@/components/BandTable";
import BandTableFooter from "@/components/BandTableFooter";

import { useState } from "react";

function bandTableContainer() {
  const [tableLayoutMode, setTableLayoutMode] = useState("list");

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-3">
        <BandTableTop setTableLayoutMode={setTableLayoutMode} />
        <BandTable />
      </div>
      <BandTableFooter />
    </div>
  );
}

export default bandTableContainer;
