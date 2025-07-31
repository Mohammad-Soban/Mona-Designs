import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SizeSelectorProps {
  sizes: string[] | undefined;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  required?: boolean;
}

export function SizeSelector({ sizes, selectedSize, onSizeSelect, required = true }: SizeSelectorProps) {
  const availableSizes = sizes || ["S", "M", "L", "XL"];

  return (
    <div>
      <h3 className="font-semibold mb-3">
        Size {selectedSize && <span className="text-gold">({selectedSize})</span>}
        {required && !selectedSize && <span className="text-red-500">*</span>}
      </h3>
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={cn(
              "px-4 py-2 border rounded-md transition-all duration-300 font-medium cursor-pointer",
              "hover:border-gold hover:bg-gold/20 hover:scale-105 active:scale-95",
              selectedSize === size
                ? "border-gold bg-gold text-white shadow-lg scale-105 ring-2 ring-gold/30"
                : "border-border bg-background hover:shadow-md"
            )}
          >
            {size}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        <Link to="/size-guide" className="text-gold hover:underline">Size Guide</Link>
        {required && !selectedSize && <span className="text-red-500 ml-2">Please select a size</span>}
      </p>
    </div>
  );
}
