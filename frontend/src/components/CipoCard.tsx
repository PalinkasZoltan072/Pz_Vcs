import { Link } from "@tanstack/react-router"
import { Card, CardContent } from "./ui/card" 
import type { Cipo } from "../data/cipoService"

type Props = {
  cipo: Cipo
}

function CipoCard({ cipo }: Props) {
  const boritoKep = cipo.kepek && cipo.kepek.length > 0 ? cipo.kepek[0].url : null;

  return (
    <Link to="/cipok/$id" params={{ id: cipo.id.toString() }} className="block group">
      <Card className="w-[220px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-100 group-hover:border-gray-300">
        <CardContent className="p-4">

          <div className="h-32 rounded-md overflow-hidden mb-3 bg-gray-50 flex items-center justify-center relative">
            {boritoKep ? (
              <img
                src={`/kepek/${cipo.nev}/${boritoKep}`}
                alt={cipo.nev}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="text-gray-400 font-semibold text-xs">{cipo.marka}</span>
            )}
          </div>

          <h3 className="font-bold text-lg truncate text-gray-900" title={cipo.nev}>
            {cipo.nev}
          </h3>

          <div className="mt-2 min-h-[24px]">
            {cipo.Meretek && cipo.Meretek.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {cipo.Meretek.map((m, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-gray-100 border border-gray-200 text-xs font-medium px-1.5 py-0.5 rounded-sm text-gray-600"
                  >
                    {m.meret}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400">Nincs méret</span>
            )}
          </div>

          <div className="mt-4">
            <span className="text-black font-black text-lg tracking-tight">
              {cipo.ar.toLocaleString()} Ft
            </span>
          </div>

        </CardContent>
      </Card>
    </Link>
  )
}

export default CipoCard