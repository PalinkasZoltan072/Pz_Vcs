import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart } from "../context/cartContext";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LogIn } from "lucide-react";
// Itt beimportáltuk az új updateFelhasznaloCim függvényt is!
import { getFelhasznalo, getTokenPayload, createRendeles, updateFelhasznaloCim } from "../data/checkoutService";

import { AddressSection } from "../components/checkout/AddressSection";
import { PaymentSection } from "../components/checkout/PaymentSection";
import { OrderSummary } from "../components/checkout/OrderSummary";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, totalSum, clearCart } = useCart();
  const [fizetes, setFizetes] = useState<"kártyával" | "utánvéttel">("kártyával");
  
  const [utca, setUtca] = useState("");
  const [hazszam, setHazszam] = useState("");
  const [cimMentve, setCimMentve] = useState(false);

  const [kartyanev, setKartyanev] = useState("");
  const [kartyaszam, setKartyaszam] = useState("");
  const [lejaratHonap, setLejaratHonap] = useState("");
  const [lejaratEv, setLejaratEv] = useState("");
  const [cvc, setCvc] = useState("");
  
  const [siker, setSiker] = useState(false);
  const navigate = useNavigate();

  const tokenPayload = getTokenPayload();
  const userId = tokenPayload?.id;

  const { data: felhasznalo, isLoading: userLoading } = useQuery({
    queryKey: ["felhasznalo", userId],
    queryFn: () => getFelhasznalo(userId!),
    enabled: !!userId,
  });

  const hasFullAddress = felhasznalo?.telepules?.includes(",") || false;

  const { mutate: rendelesekLeadas, isPending } = useMutation({
    mutationFn: async () => {
      
      // 1. Cím frissítése (MOST MÁR A SERVICE-T HASZNÁLJUK FETCH HELYETT!)
      if (!hasFullAddress && cimMentve && utca && hazszam) {
        const teljesCim = `${felhasznalo?.telepules}, ${utca} ${hazszam}`;
        await updateFelhasznaloCim(userId!, teljesCim);
      }

      // 2. Rendelések leadása
      for (const item of cart) {
        await createRendeles({
          cipoId: item.id,
          mennyiseg: item.mennyiseg,
          fizetes,
          meret: item.meret,
        });
      }
    },
    onSuccess: () => {
      clearCart();
      setSiker(true);
    },
    onError: () => {
      alert("Hiba történt a rendelés leadásakor. Próbáld újra!");
    },
  });

  const isAddressMissing = !hasFullAddress && !cimMentve;
  const isCardMissing = fizetes === "kártyával" && (!kartyanev || !kartyaszam || !lejaratHonap || !lejaratEv || !cvc);
  const isDisabled = isPending || cart.length === 0 || isAddressMissing || isCardMissing;

  if (!userId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <LogIn className="w-16 h-16 mx-auto text-gray-300 mb-6" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Bejelentkezés szükséges</h2>
        <p className="text-gray-500 mb-8">A rendelés leadásához kérjük, jelentkezz be!</p>
        <Link to="/login">
          <Button className="bg-black text-white hover:bg-gray-800 font-bold px-8 h-12">
            Bejelentkezés
          </Button>
        </Link>
      </div>
    );
  }

  if (siker) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle2 className="w-20 h-20 mx-auto text-green-500 mb-6" />
        <h2 className="text-3xl font-black text-gray-900 mb-3">Rendelés leadva!</h2>
        <p className="text-gray-500 mb-8">Köszönjük a vásárlást! Rendelésed hamarosan feldolgozzuk.</p>
        <Button onClick={() => navigate({ to: "/" })} className="bg-black text-white hover:bg-gray-800 font-bold px-8 h-12">
          Vissza a főoldalra
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <h1 className="text-3xl font-black mb-10 uppercase tracking-tighter">Pénztár</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <AddressSection 
            felhasznalo={felhasznalo} userLoading={userLoading} hasFullAddress={hasFullAddress}
            cimMentve={cimMentve} setCimMentve={setCimMentve} utca={utca} setUtca={setUtca} hazszam={hazszam} setHazszam={setHazszam}
          />
          <PaymentSection 
            fizetes={fizetes} setFizetes={setFizetes} kartyanev={kartyanev} setKartyanev={setKartyanev}
            kartyaszam={kartyaszam} setKartyaszam={setKartyaszam} lejaratHonap={lejaratHonap} setLejaratHonap={setLejaratHonap}
            lejaratEv={lejaratEv} setLejaratEv={setLejaratEv} cvc={cvc} setCvc={setCvc}
          />
        </div>
        <OrderSummary 
          cart={cart} totalSum={totalSum} fizetes={fizetes} isPending={isPending}
          isDisabled={isDisabled} isAddressMissing={isAddressMissing} isCardMissing={isCardMissing}
          onCheckout={() => rendelesekLeadas()}
        />
      </div>
    </div>
  );
}