import { FaStar } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

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

const Category = ({ title, items, isSkill, className }: CategoryProps) => (
  <div
    className={`flex flex-col p-3 border-r border-border-extralight w-1/2 last:border-r-0 $ hover:bg-hover cursor-pointer ${className}`}
  >
    <span className="font-bold">{title}</span>
    <ul className="flex flex-wrap">
      {items.map((item, index) => (
        <li key={index} className="mt-1.5 mr-1.5">
          <Badge variant="outline">
            <span className="flex items-center gap-x-1">
              {typeof item === "string" ? item : item.name}{" "}
              {isSkill && typeof item !== "string" && item.isMain && (
                <FaStar className="text-foreground opacity-60" />
              )}
            </span>
          </Badge>
        </li>
      ))}
    </ul>
  </div>
);

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
        title="Jeux"
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
