import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function AddressSection({ felhasznalo, userLoading, hasFullAddress, cimMentve, setCimMentve, utca, setUtca, hazszam, setHazszam }: any) {
  if (userLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (!felhasznalo) return null;

  const showFullAddress = hasFullAddress || cimMentve;
  const displayAddress = hasFullAddress 
    ? `${felhasznalo.iranyitoszam} ${felhasznalo.telepules}` 
    : `${felhasznalo.iranyitoszam} ${felhasznalo.telepules}, ${utca} ${hazszam}`;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
        Szállítási adatok
      </h2>

      <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-400 uppercase tracking-wider mb-1">Felhasználónév</Label>
            <p className="font-semibold text-gray-900">{felhasznalo.felhasznalonev}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</Label>
            <p className="font-semibold text-gray-900">{felhasznalo.email}</p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              {showFullAddress ? "Teljes szállítási cím" : "Regisztrált település"}
            </Label>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              {showFullAddress ? displayAddress : `${felhasznalo.iranyitoszam} ${felhasznalo.telepules}`}
              {showFullAddress && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </p>
          </div>
        </div>
      </div>

      {!showFullAddress && (
        <div className="p-5 bg-orange-50 border border-orange-200 rounded-xl space-y-3">
          <p className="text-sm font-bold text-orange-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Pontos szállítási cím hiányzik!
          </p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="utca" className="text-orange-900">Utca neve</Label>
              <Input id="utca" value={utca} onChange={(e) => setUtca(e.target.value)} placeholder="pl. Petőfi utca" className="bg-white border-orange-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hazszam" className="text-orange-900">Házszám</Label>
              <Input id="hazszam" value={hazszam} onChange={(e) => setHazszam(e.target.value)} placeholder="pl. 12/B" className="bg-white border-orange-200" />
            </div>
          </div>
          <Button 
            onClick={() => setCimMentve(true)} 
            disabled={!utca || !hazszam}
            className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white"
          >
            Cím mentése a rendeléshez
          </Button>
        </div>
      )}
    </section>
  );
}