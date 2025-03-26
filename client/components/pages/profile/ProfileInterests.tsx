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
}

const Category = ({ title, items, isSkill }: CategoryProps) => (
  <div className="flex flex-col p-3 border-r border-secondary w-1/2 last:border-r-0">
    <span className="font-bold">{title}</span>
    <ul className="flex flex-wrap">
      {items.map((item, index) => (
        <li key={index} className="mt-3 mr-1.5">
          <Badge variant="outline">
            <span className="flex items-center gap-x-1">
              {typeof item === "string" ? item : item.name}{" "}
              {isSkill && typeof item !== "string" && item.isMain && (
                <FaStar color="orange" />
              )}
            </span>
          </Badge>
        </li>
      ))}
    </ul>
  </div>
);

export const ProfileInterests = () => {
  const games: Skill[] = [
    { name: "Guitare", isMain: true },
    { name: "Piano", isMain: false },
  ];

  const musicStyles = ["Rock", "Pop", "Jazz", "Hip-Hop", "Reggae"].map(
    (name) => ({ name })
  );

  return (
    <div className="flex border border-secondary rounded-xl">
      <Category title="Jeux" items={games} isSkill />
      <Category title="Styles musicaux" items={musicStyles} />
    </div>
  );
};
