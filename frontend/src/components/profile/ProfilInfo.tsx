import { User, Mail, MapPin } from "lucide-react";

export function ProfileInfo({ felhasznalo, userLoading }: any) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-gray-500" />
        </div>
        
        {userLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ) : felhasznalo ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">{felhasznalo.felhasznalonev}</h2>
              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" /> {felhasznalo.email}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Szállítási cím</p>
              <p className="text-gray-700 text-sm flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {felhasznalo.telepules ? (
                  `${felhasznalo.iranyitoszam} ${felhasznalo.telepules}`
                ) : (
                  <span className="text-red-500 font-semibold text-xs">Nincs megadva cím!</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-red-500 font-bold">Hiba az adatok betöltésekor.</p>
        )}
      </div>
    </div>
  );
}