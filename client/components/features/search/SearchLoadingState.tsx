interface SearchLoadingStateProps {
  query?: string;
}

export const SearchLoadingState = ({ query }: SearchLoadingStateProps) => (
  <div className="p-4">
    <div className="mb-4 text-sm text-muted-foreground">
      Recherche en cours{query ? ` pour "${query}"` : ""}...
    </div>
  </div>
);
