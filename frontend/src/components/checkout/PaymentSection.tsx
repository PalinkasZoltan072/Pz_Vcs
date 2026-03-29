import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Truck } from "lucide-react";

export function PaymentSection({ fizetes, setFizetes, kartyanev, setKartyanev, kartyaszam, setKartyaszam, lejaratHonap, setLejaratHonap, lejaratEv, setLejaratEv, cvc, setCvc }: any) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
        Fizetési mód
      </h2>
      
      <RadioGroup value={fizetes} onValueChange={(v) => setFizetes(v)} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-3">
          <RadioGroupItem value="kártyával" id="card" className="peer sr-only" />
          <Label htmlFor="card" className="flex items-center gap-4 rounded-xl border-2 border-muted bg-white p-5 hover:bg-gray-50 peer-data-[state=checked]:border-black cursor-pointer transition-all">
            <CreditCard className="h-7 w-7" />
            <div>
              <span className="font-bold text-base block">Bankkártya</span>
              <span className="text-xs text-gray-400">Biztonságos fizetés</span>
            </div>
          </Label>

          {fizetes === "kártyával" && (
            <div className="grid gap-4 p-4 border rounded-xl bg-gray-50 animate-in fade-in slide-in-from-top-2">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs">Név a kártyán</Label>
                <Input id="name" placeholder="Kovács János" value={kartyanev} onChange={(e) => setKartyanev(e.target.value)} className="bg-white h-9 text-xs" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="number" className="text-xs">Kártyaszám</Label>
                <Input id="number" placeholder="0000 0000 0000 0000" maxLength={19} value={kartyaszam} onChange={(e) => setKartyaszam(e.target.value)} className="bg-white h-9 text-xs font-mono" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="grid gap-2">
                  <Label className="text-xs">Hó</Label>
                  <Select value={lejaratHonap} onValueChange={setLejaratHonap}>
                    <SelectTrigger className="bg-white h-9 text-xs"><SelectValue placeholder="Hó" /></SelectTrigger>
                    <SelectContent position="popper">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <SelectItem key={i} value={`${i + 1}`}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">Év</Label>
                  <Select value={lejaratEv} onValueChange={setLejaratEv}>
                    <SelectTrigger className="bg-white h-9 text-xs"><SelectValue placeholder="Év" /></SelectTrigger>
                    <SelectContent position="popper">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>{new Date().getFullYear() + i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc" className="text-xs">CVC</Label>
                  <Input id="cvc" placeholder="CVC" maxLength={3} value={cvc} onChange={(e) => setCvc(e.target.value)} className="bg-white h-9 text-xs" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <RadioGroupItem value="utánvéttel" id="cod" className="peer sr-only" />
          <Label htmlFor="cod" className="flex items-center gap-4 rounded-xl border-2 border-muted bg-white p-5 hover:bg-gray-50 peer-data-[state=checked]:border-black cursor-pointer transition-all">
            <Truck className="h-7 w-7" />
            <div>
              <span className="font-bold text-base block">Utánvét</span>
              <span className="text-xs text-gray-400">Fizetés a futárnál</span>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </section>
  );
}