import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getCipoById, type Cipo } from '../../data/cipoService'
import { Button } from '../../components/ui/button' 
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/cartContext'
export const Route = createFileRoute('/cipok/$id')({
  component: CipoDetailPage,
})

function CipoDetailPage() {
  const { id } = Route.useParams()
  const [cipo, setCipo] = useState<Cipo | null>(null)
  const { addToCart } = useCart();


  // Állapotok (State-ek) a felhasználói interakciókhoz
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIdx, setCurrentImageIdx] = useState(0) // Melyik kép van épp kiválasztva

  useEffect(() => {
    getCipoById(Number(id)).then(setCipo)
  }, [id])

  if (!cipo) return <div className="p-20 text-center font-bold text-2xl animate-pulse text-gray-400">Cipő betöltése...</div>

  // Képek kezelése (Ha nincs kép, adunk egy üres tömböt, hogy ne fagyjon ki)
  const kepek = cipo.kepek && cipo.kepek.length > 0 ? cipo.kepek : [{ url: null }]
  const currentImage = kepek[currentImageIdx].url
  const kepUrl = currentImage ? `/kepek/${cipo.nev}/${currentImage}` : "https://placehold.co/600x600?text=Nincs+Kép"

  // Lapozó függvények
  const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % kepek.length)
  const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + kepek.length) % kepek.length)

  const handleAddToCart = () => {
    if (selectedSize && cipo) {
      addToCart({
        id: cipo.id,
        nev: cipo.nev,
        ar: cipo.ar,
        meret: selectedSize,
        mennyiseg: quantity,
        kep: kepek[0].url || ''
      });
      alert("Kosárba tetted!"); // Egyelőre csak egy sima alert, amíg nincs Toast
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* ================= BAL OLDAL: KÉPGALÉRIA lapozóval ================= */}
        <div className="w-full md:w-1/2">
          {/* Fő nagy kép a nyilakkal */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group">
            <img src={kepUrl} alt={cipo.nev} className="w-full h-full object-cover" />
            
            {/* Nyilak csak akkor jelennek meg, ha több mint 1 kép van, és a kép fölé visszük az egeret */}
            {kepek.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100">
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100">
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}
          </div>

          {/* Kis indexképek (Thumbnails) alul */}
          {kepek.length > 1 && (
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2 px-1">
              {kepek.map((kep, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImageIdx(idx)}
                  className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${currentImageIdx === idx ? 'border-black shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={`/kepek/${cipo.nev}/${kep.url}`} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= JOBB OLDAL: ADATOK ÉS VÁSÁRLÁS ================= */}
        <div className="w-full md:w-1/2 flex flex-col pt-4">
          
          <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">{cipo.marka}</p>
          <h1 className="text-4xl font-black text-gray-900 mt-2 mb-4 tracking-tight">{cipo.nev}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-8">{cipo.ar.toLocaleString()} Ft</p>

          {/* MÉRETVÁLASZTÓ */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-lg font-bold text-gray-900">Válassz méretet</h3>
            </div>
            
            {cipo.Meretek && cipo.Meretek.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {cipo.Meretek.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(m.meret)}
                    className={`py-3 text-center rounded-lg border-2 font-bold transition-all ${
                      selectedSize === m.meret 
                        ? 'border-black bg-black text-white shadow-md' 
                        : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400'
                    }`}
                  >
                    {m.meret}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-red-500 font-semibold">Jelenleg nincs elérhető méret.</p>
            )}
          </div>

          {/* MENNYISÉG */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Mennyiség</h3>
            <div className="flex items-center border-2 border-gray-200 rounded-lg w-max bg-white">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))} // azért használjuk hogy -1 mennyiséget ne lehessen megadni
                className="p-3 hover:bg-gray-100 transition rounded-l-lg border-r border-gray-100"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <span className="w-14 text-center font-bold text-xl">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="p-3 hover:bg-gray-100 transition rounded-r-lg border-l border-gray-100"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* ÖSSZEGZÉS ÉS KOSÁR GOMB */}
          <div className="mt-auto bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Kiválasztott méret:</span>
              <span className="font-bold text-lg">{selectedSize ? `${selectedSize} EU` : <span className="text-red-500">Kérlek válassz!</span>}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Fizetendő összesen:</span>
              <span className="font-black text-2xl text-black">{(cipo.ar * quantity).toLocaleString()} Ft</span>
            </div>
            
            <Button onClick={handleAddToCart} disabled={!selectedSize}   
              className="w-full h-16 text-xl font-bold bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 transition-all flex items-center justify-center gap-2 rounded-xl"
            >
              <ShoppingCart className="w-6 h-6" />
              {selectedSize ? 'Kosárba teszem' : 'Válassz méretet a folytatáshoz'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}