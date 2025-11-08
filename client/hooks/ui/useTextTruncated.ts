import { useRef, useEffect, useState } from "react";

interface UseTextTruncatedOptions {
  maxLines?: number;
}

interface UseTextTruncatedReturn {
  isTruncated: boolean;
  textRef: React.RefObject<HTMLDivElement | null>;
  measureRef: React.RefObject<HTMLDivElement | null>;
}

export const useTextTruncated = (
  text: string,
  options: UseTextTruncatedOptions = {}
): UseTextTruncatedReturn => {
  const { maxLines = 5 } = options;

  const textRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkIfTextTruncated = () => {
      if (textRef.current && measureRef.current) {
        const measureElement = measureRef.current;
        const displayElement = textRef.current;

        // Copy display element styles to measure element
        const computedStyle = window.getComputedStyle(displayElement);
        measureElement.style.fontSize = computedStyle.fontSize;
        measureElement.style.fontFamily = computedStyle.fontFamily;
        measureElement.style.fontWeight = computedStyle.fontWeight;
        measureElement.style.lineHeight = computedStyle.lineHeight;
        measureElement.style.width = computedStyle.width;
        measureElement.style.padding = computedStyle.padding;
        measureElement.style.margin = computedStyle.margin;
        measureElement.style.letterSpacing = computedStyle.letterSpacing;
        measureElement.style.wordSpacing = computedStyle.wordSpacing;

        const actualHeight = measureElement.scrollHeight;
        const lineHeight =
          parseFloat(computedStyle.lineHeight) ||
          parseFloat(computedStyle.fontSize) * 1.2;
        const maxHeight = lineHeight * maxLines;

        setIsTruncated(actualHeight > maxHeight);
      }
    };

    const timeoutId = setTimeout(checkIfTextTruncated, 0);

    const handleResize = () => {
      checkIfTextTruncated();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [text, maxLines]);

  return {
    isTruncated,
    textRef,
    measureRef,
  };
};
