"use client";

import {
  BandTableTop,
  BandTable,
  BandTableFooter,
} from "@/components/table/index";

import { useState } from "react";

function BandTableContainer() {
  const [tableLayoutMode, setTableLayoutMode] = useState<"grid" | "list">(
    "list"
  );

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-3">
        <BandTableTop
          tableLayoutMode={tableLayoutMode}
          setTableLayoutMode={setTableLayoutMode}
        />
        <BandTable tableLayoutMode={tableLayoutMode} />
      </div>
      <BandTableFooter />
    </div>
  );
}

export default BandTableContainer;
