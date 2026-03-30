import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { getFelhasznalo, getTokenPayload, getFelhasznaloRendelesek } from "../data/checkoutService";

// Importáljuk komponenseinket!
import { ProfileInfo } from "../components/profile/ProfilInfo";
import { OrderHistory } from "../components/profile/OrderHistory";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const tokenPayload = getTokenPayload();
  const userId = tokenPayload?.id;

  if (!userId) {
    navigate({ to: "/login" });
    return null;
  }

  // 1. Felhasználó lekérése a service-ből
  const { data: felhasznalo, isLoading: userLoading } = useQuery({
    queryKey: ["felhasznalo", userId],
    queryFn: () => getFelhasznalo(userId),
  });

  // 2. Rendelések lekérése axios-szal a service-ből
  const { data: rendelesek, isLoading: ordersLoading } = useQuery({
    queryKey: ["rendelesek", userId],
    queryFn: () => getFelhasznaloRendelesek(userId),
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Profilom</h1>
        <Button onClick={handleLogout} variant="destructive" className="font-bold gap-2">
          <LogOut className="w-4 h-4" /> Kijelentkezés
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProfileInfo felhasznalo={felhasznalo} userLoading={userLoading} />
        <OrderHistory rendelesek={rendelesek} ordersLoading={ordersLoading} />
      </div>
    </div>
  );
}