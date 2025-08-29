
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number,
  stock:number
  image?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getShipping: () => number
  getTax: () => number
  getTotal: () => number
}

export const useCartStore= create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find(i => i.id === item.id)
        if (existingItem) {
          set({
            items: get().items.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          })
        } else {
          set({ items: [...get().items, item] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter(i => i.id !== id),
          })
        } else {
         
          set({
            items: get().items.map(i =>
              i.id === id ? { ...i, quantity } : i
            ),
          })
        }
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal > 500 ? 29 : 0
      },

      getTax: () => {
        const subtotal = get().getSubtotal()
        return subtotal * 0.08
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShipping()
        const tax = get().getTax()
        return subtotal + shipping + tax
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
