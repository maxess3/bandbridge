interface SearchEmptyStateProps {
  query?: string;
  message?: string;
}

export const SearchEmptyState = ({ query, message }: SearchEmptyStateProps) => {
  if (message) {
    return <div className="p-4">{message}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 text-sm text-muted-foreground">
        Résultats pour "{query}"
      </div>
      <div>Aucun profil trouvé.</div>
    </div>
  );
};
