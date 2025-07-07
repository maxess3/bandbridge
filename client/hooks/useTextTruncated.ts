import { useRef, useEffect, useState } from "react";

interface UseTextTruncatedOptions {
  maxLines?: number;
}

interface UseTextTruncatedReturn {
  isTruncated: boolean;
  textRef: React.RefObject<HTMLDivElement>;
  measureRef: React.RefObject<HTMLDivElement>;
}

export const useTextTruncated = (
  text: string,
  options: UseTextTruncatedOptions = {}
): UseTextTruncatedReturn => {
  const { maxLines = 5 } = options;

  const textRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  // Détecter si le texte est coupé en utilisant un élément de mesure caché
  useEffect(() => {
    const checkIfTextTruncated = () => {
      if (textRef.current && measureRef.current) {
        const measureElement = measureRef.current;
        const displayElement = textRef.current;

        // Copier les styles de l'élément d'affichage vers l'élément de mesure
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

        // Mesurer la hauteur réelle
        const actualHeight = measureElement.scrollHeight;

        // Calculer la hauteur maximale autorisée
        const lineHeight =
          parseFloat(computedStyle.lineHeight) ||
          parseFloat(computedStyle.fontSize) * 1.2;
        const maxHeight = lineHeight * maxLines;

        setIsTruncated(actualHeight > maxHeight);
      }
    };

    // Délai pour s'assurer que le DOM est rendu
    const timeoutId = setTimeout(checkIfTextTruncated, 0);

    // Re-vérifier lors du redimensionnement de la fenêtre
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
