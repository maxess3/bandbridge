"use client";

import BandTableTop from "@/components/BandTableTop";
import BandTable from "@/components/BandTable";
import BandTableFooter from "@/components/BandTableFooter";

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
