import { PackageSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No Products Available",
  message = "We're working hard to bring new products to this collection. Please check back soon!",
  icon = <PackageSearch className="h-12 w-12 text-gold/50" />,
}: EmptyStateProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="flex flex-col items-center space-y-6 max-w-md">
        {icon}
        <h2 className="text-3xl font-serif font-semibold text-gold">{title}</h2>
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}