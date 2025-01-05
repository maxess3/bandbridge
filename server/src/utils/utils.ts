// Formats the name by capitalizing the first letter and converting the rest to lowercase
export const formatName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
