import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { getCipok, type Cipo, type CipoFilters } from "../data/cipoService"
import CipoCard from "../components/CipoCard"
import FilterSidebar from "../components/FilterSidebar"

export const Route = createFileRoute("/")({
component: HomePage,
})

function HomePage() {
const [cipok, setCipok] = useState<Cipo[]>([])


const [filters, setFilters] = useState<CipoFilters>({})
const [triggerSearch, setTriggerSearch] = useState(0)

useEffect(() => {
getCipok(filters).then(setCipok)
}, [triggerSearch])

const handleSearch = () => {
setTriggerSearch(prev => prev + 1)
}

return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

  <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">
    Kínálatunk
  </h1>

  <div className="flex flex-col md:flex-row gap-8">
    
    
    <div className="w-full md:w-1/4">
      <FilterSidebar 
        filters={filters} 
        setFilters={setFilters} 
        onSearch={handleSearch} 
      />
    </div>

   
    <div className="w-full md:w-3/4">
      
      {cipok.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cipok.map((cipo) => (
            <CipoCard key={cipo.id} cipo={cipo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
          <h3 className="text-xl font-bold text-gray-900">Nincs találat</h3>
          <p className="mt-2 text-gray-500">Ilyen feltételekkel nem találtunk cipőt az adatbázisban.</p>
        </div>
      )}

    </div>

  </div>
</div>

)
}