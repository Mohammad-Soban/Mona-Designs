import { Plus, Minus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  inStock?: number;
}

export function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 10,
  inStock 
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Quantity</h3>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md bg-background">
          <button
            onClick={handleDecrease}
            disabled={quantity <= min}
            className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={quantity >= max}
            className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {inStock && (
          <span className="text-sm text-muted-foreground">
            In Stock ({inStock} left!)
          </span>
        )}
      </div>
    </div>
  );
}
