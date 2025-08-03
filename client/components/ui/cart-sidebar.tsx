import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartSidebar() {
  const { state, removeItem, updateQuantity, closeCart, getCartTotal, getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Backdrop */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-background border-l shadow-xl transform transition-transform duration-300 z-50",
          state.isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                Shopping Cart ({getCartItemsCount()})
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Add some beautiful ethnic wear to get started
                </p>
                <Button onClick={closeCart} className="bg-gold hover:bg-gold/90">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="flex space-x-4 p-4 border rounded-lg">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          Size: {item.size}
                        </Badge>
                        {item.color && (
                          <Badge variant="outline" className="text-xs">
                            {item.color}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{item.price}</span>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="p-1 hover:bg-muted"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="p-1 hover:bg-muted"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full bg-gold hover:bg-gold/90" size="lg">
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Free shipping on orders above ₹2,999
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
