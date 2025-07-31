import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  colors: string[] | undefined;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  required?: boolean;
}

export function ColorSelector({ colors, selectedColor, onColorSelect, required = false }: ColorSelectorProps) {
  const availableColors = colors || ["Black", "Navy", "Grey"];

  return (
    <div>
      <h3 className="font-semibold mb-3">
        Color: {selectedColor ? (
          <span className="text-gold">{selectedColor}</span>
        ) : (
          <span className="text-muted-foreground">Select Color</span>
        )}
        {required && !selectedColor && <span className="text-red-500">*</span>}
      </h3>
      <div className="flex flex-wrap gap-2">
        {availableColors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={cn(
              "px-4 py-2 border rounded-md transition-all duration-300 font-medium cursor-pointer",
              "hover:border-gold hover:bg-gold/20 hover:scale-105 active:scale-95",
              selectedColor === color
                ? "border-gold bg-gold text-white shadow-lg scale-105 ring-2 ring-gold/30"
                : "border-border bg-background hover:shadow-md"
            )}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
}
