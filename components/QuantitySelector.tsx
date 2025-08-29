import { CartItem, useCartStore } from "@/app/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

export function QuantitySelector({ item }: { item:CartItem}) {

    const {updateQuantity} = useCartStore()

  return (
    <div className="flex items-center border border-slate-300 rounded-lg">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => updateQuantity(item.id, item.quantity - 1)}
      className="h-8 w-8"
      disabled={item.stock <= 1}
    >
      <Minus className="h-4 w-4" />
    </Button>
    <span className="px-3 py-1 text-center min-w-[2rem]">{item.quantity}</span>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => updateQuantity(item.id, item.quantity + 1)}
      disabled={item.quantity > item.stock}
      className="h-8 w-8"
      
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
  );
}
