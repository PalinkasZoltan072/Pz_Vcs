import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "../context/cartContext"
import { Button } from "./ui/button"
import { useNavigate } from "@tanstack/react-router"

export function CartSheet() {
  const { cart, cartCount, removeFromCart } = useCart()
  const navigate = useNavigate();

  const totalSum = cart.reduce((sum, item) => sum + (item.ar * item.mennyiseg), 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 text-gray-400 hover:text-gray-500 ml-4">
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-black">
            KOSÁR ({cartCount})
          </SheetTitle>
        </SheetHeader>

        
        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">
              A kosarad még üres.
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.meret}`} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border">
                    <img src={`/kepek/${item.nev}/${item.kep}`} alt={item.nev} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-bold text-sm leading-tight">{item.nev}</h4>
                      <p className="text-xs text-gray-400 mt-1">Méret: {item.meret} EU | {item.mennyiseg} db</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="font-black text-blue-600 text-sm">{(item.ar * item.mennyiseg).toLocaleString()} Ft</p>
                      <button
                        onClick={() => removeFromCart(item.id, item.meret)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

             
              <div className="pt-6 border-t border-dashed space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Összeg:</span>
                  <span className="font-black text-xl">{totalSum.toLocaleString()} Ft</span>
                </div>
                <Button
                  onClick={() => navigate({ to: "/checkout" })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  Tovább a fizetéshez
                </Button>
                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
                  Ingyenes szállítás és visszaküldés
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}