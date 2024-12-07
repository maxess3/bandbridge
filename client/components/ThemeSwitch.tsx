"use client";

import { FaMoon } from "react-icons/fa6";
import { IoMdSunny } from "react-icons/io";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (resolvedTheme === "dark") {
    return (
      <button
        className="flex items-center h-full"
        onClick={() => setTheme("light")}
      >
        <FaMoon className="text-xl" />
      </button>
    );
  }

  if (resolvedTheme === "light") {
    return (
      <button
        className="flex items-center h-full"
        onClick={() => setTheme("dark")}
      >
        <IoMdSunny className="text-xl" />
      </button>
    );
  }
}

export default ThemeSwitch;
