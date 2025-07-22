import { FaStar } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface Skill {
  name: string;
  isMain?: boolean;
}

interface CategoryProps {
  title: string;
  items: (string | Skill)[];
  isSkill?: boolean;
  className?: string;
}

const Category = ({ title, items, isSkill, className }: CategoryProps) => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`flex flex-col px-4 pb-4 pt-2 bg-[#111111] w-1/2 last:border-r-0 ${className}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <span className="font-extrabold text-lg">{title}</span>
        </div>
        <div>
          <Link
            href={`/edit/profile/info`}
            className="relative group flex justify-center items-center rounded-full w-12 h-12 hover:bg-hover"
          >
            <Pencil
              style={{ width: "1.3em", height: "1.3em" }}
              className="text-foreground/80 group-hover:text-foreground"
            />
          </Link>
        </div>
      </div>

      <div className="relative">
        <ul
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2"
        >
          {items.map((item, index) => (
            <li key={index} className="flex-shrink-0">
              <Badge variant="outline" className="text-sm whitespace-nowrap">
                <span className="flex items-center gap-1">
                  {typeof item === "string" ? item : item.name}{" "}
                  {isSkill && typeof item !== "string" && item.isMain && (
                    <FaStar className="text-primary" />
                  )}
                </span>
              </Badge>
            </li>
          ))}
        </ul>

        {/* Flèche gauche */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white rounded-full p-1.5 transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Flèche droite */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white rounded-full p-1.5 transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export const ProfileMusicInterests = () => {
  const games: Skill[] = [
    { name: "Guitare", isMain: true },
    { name: "Piano", isMain: false },
  ];

  const musicStyles = ["Rock", "Pop", "Jazz", "Hip-Hop"].map((name) => ({
    name,
  }));

  return (
    <div className="flex border rounded-xl">
      <Category
        title="Instruments"
        items={games}
        isSkill
        className="rounded-tl-xl rounded-bl-xl"
      />
      <Category
        title="Styles musicaux"
        items={musicStyles}
        className="rounded-tr-xl rounded-br-xl"
      />
    </div>
  );
};
