import { Button } from "@/components/ui/button";

export function OrderSummary({ cart, totalSum, fizetes, isPending, isDisabled, isAddressMissing, isCardMissing, onCheckout }: any) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold">Rendelésed ({cart.length} tétel)</h3>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {cart.map((item: any) => (
            <div key={`${item.id}-${item.meret}`} className="flex gap-3 text-sm">
              <img src={`/kepek/${item.nev}/${item.kep}`} className="w-14 h-14 rounded-lg object-cover border flex-shrink-0" alt={item.nev} />
              <div className="flex-1">
                <p className="font-bold line-clamp-1">{item.nev}</p>
                <p className="text-gray-400 text-xs mt-0.5">{item.meret} EU · {item.mennyiseg} db</p>
                <p className="font-black text-sm mt-1">{(item.ar * item.mennyiseg).toLocaleString()} Ft</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Szállítás</span>
            <span className="text-green-600 font-bold uppercase text-xs tracking-wide">Ingyenes</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Fizetési mód</span>
            <span className="font-semibold text-gray-900 capitalize">{fizetes}</span>
          </div>
          <div className="flex justify-between text-xl font-black pt-3 border-t">
            <span>Összesen</span>
            <span>{totalSum ? totalSum.toLocaleString() : "0"} Ft</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onCheckout}
            disabled={isDisabled}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg font-bold rounded-xl shadow-lg disabled:bg-gray-300 transition-all"
          >
            {isPending ? "Feldolgozás..." : "Rendelés befejezése"}
          </Button>
          
          {isAddressMissing && <p className="text-xs text-orange-600 text-center font-bold">Kérjük, add meg és mentsd el a szállítási címet!</p>}
          {isCardMissing && !isAddressMissing && <p className="text-xs text-red-500 text-center font-bold">Kérjük, töltsd ki a bankkártya adatait!</p>}
        </div>
      </div>
    </div>
  );
}