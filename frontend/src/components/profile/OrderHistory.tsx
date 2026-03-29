import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function OrderHistory({ rendelesek, ordersLoading }: any) {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Package className="w-6 h-6" /> Korábbi rendeléseim
      </h2>

      {ordersLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-100 rounded-xl w-full" />
          <div className="h-24 bg-gray-100 rounded-xl w-full" />
        </div>
      ) : !rendelesek || rendelesek.length === 0 ? (
        <div className="bg-gray-50 border border-dashed rounded-2xl p-10 text-center">
          <p className="text-gray-500 mb-4">Még nem adtál le egyetlen rendelést sem.</p>
          <Button onClick={() => navigate({ to: "/" })} className="bg-black text-white hover:bg-gray-800">
            Vásárlás megkezdése
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {rendelesek.map((rendeles: any) => (
            <div key={rendeles.id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1">Rendelés #{rendeles.id}</p>
                <p className="font-bold">Cipő azonosító: {rendeles.Cipo_id} <span className="text-gray-400 font-normal">| Méret: {rendeles.meret}</span></p>
                <p className="text-sm text-gray-500 mt-1">
                  Fizetés: <span className="font-semibold text-gray-700 capitalize">{rendeles.fizetes}</span> · Mennyiség: {rendeles.mennyiseg} db
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  rendeles.allapot === "kiszállítva" ? "bg-green-100 text-green-700" :
                  rendeles.allapot === "szállítás alatt" ? "bg-blue-100 text-blue-700" :
                  "bg-orange-100 text-orange-700"
                }`}>
                  {rendeles.allapot || "Feldolgozás alatt"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}