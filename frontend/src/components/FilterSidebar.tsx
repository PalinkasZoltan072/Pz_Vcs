import { Input } from "./ui/input"
import { Button } from "./ui/button"
import type { CipoFilters } from "../data/cipoService"

type Props = {
filters: CipoFilters;
setFilters: React.Dispatch<React.SetStateAction<CipoFilters>>;
onSearch: () => void; // Ezt hívjuk meg, ha a "Keresés" gombra kattint
}

export default function FilterSidebar({ filters, setFilters, onSearch }: Props) {

// Amikor gépel valamelyik mezőbe, frissítjük a state-et
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;
setFilters(prev => ({
...prev,
[name]: value ? (name === "marka" || name === "nev" ? value : Number(value)) : undefined
}));
};

const clearFilters = () => {
setFilters({});
};

return (
<div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm space-y-5 sticky top-24">
<h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Szűrés</h3>

  <div>
    <label className="text-sm font-semibold mb-1 block text-gray-700">Márka (pl. Nike)</label>
    <Input name="marka" value={filters.marka || ""} onChange={handleChange} />
  </div>

  <div>
    <label className="text-sm font-semibold mb-1 block text-gray-700">Méret (pl. 42)</label>
    <Input type="number" name="meret" value={filters.meret || ""} onChange={handleChange} />
  </div>

  <div className="grid grid-cols-2 gap-2">
    <div>
      <label className="text-sm font-semibold mb-1 block text-gray-700">Min. Ár</label>
      <Input type="number" name="minAr" placeholder="0" value={filters.minAr || ""} onChange={handleChange} />
    </div>
    <div>
      <label className="text-sm font-semibold mb-1 block text-gray-700">Max. Ár</label>
      <Input type="number" name="maxAr" placeholder="99999" value={filters.maxAr || ""} onChange={handleChange} />
    </div>
  </div>

  <div className="flex flex-col gap-2 pt-2">
    <Button className="w-full font-bold bg-black text-white hover:bg-gray-800" onClick={onSearch}>
      Szűrés alkalmazása
    </Button>
    <Button variant="outline" className="w-full" onClick={() => { clearFilters(); setTimeout(onSearch, 100); }}>
      Szűrők törlése
    </Button>
  </div>
</div>

)
}