import { Link } from "@tanstack/react-router"
import { useState  } from "react"
import { Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

import { CartSheet } from "./CartSheet"
import { useAuth } from '../context/AuthContext'
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn, logout } = useAuth()  // 👈 Ez az új sor
  // Szigorú bejelentkezés állapot (alapból false, azaz Bejelentkezés/Regisztráció látszik)
  

  

  
  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    
    logout();
    window.location.href = "/"; // Visszadob a főoldalra és frissít
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* BAL OLDAL: Logó */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter" onClick={closeMenu}>
              CIPŐ<span className="text-blue-600">BOLT</span>
            </Link>
          </div>
          
          {/* KÖZÉP: Asztali linkek */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-black font-medium transition-colors">
              Kezdő oldal
            </Link>
          </div>
          
          {/* JOBB OLDAL: Asztali gombok */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              // --- HA SIKERES BEJELENTKEZÉS VAN (PROFIL + KIJELENTKEZÉS) ---
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="outline" className="font-bold gap-2">
                    <User className="w-4 h-4" /> Profil
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  className="text-gray-500 hover:text-red-600 font-medium gap-2"
                >
                  <LogOut className="w-4 h-4" /> Kijelentkezés
                </Button>
              </div>
            ) : (
              // --- ALAPÁLLAPOT: HA NINCS BEJELENTKEZVE (BEJELENTKEZÉS + REGISZTRÁCIÓ) ---
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="font-medium">Bejelentkezés</Button>
                </Link>
                <Link to="/register">
                  <Button className="font-medium bg-black text-white hover:bg-gray-800">Regisztráció</Button>
                </Link>
              </div>
            )}
            
            <CartSheet />
          </div>
          
          {/* MOBIL HAMBURGER GOMB */}
          <div className="flex items-center md:hidden">
            <div className="mr-2">
              <CartSheet />
            </div>
            
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menü megnyitása">
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
          
        </div>
      </div>
      
      {/* MOBIL LENYÍLÓ MENÜ */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 shadow-inner">
            <Link 
              to="/" 
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
              onClick={closeMenu}
            >
              Összes cipő
            </Link>

            {isLoggedIn ? (
              // --- MOBIL: HA SIKERES BEJELENTKEZÉS VAN ---
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  <User className="w-5 h-5 mr-3 text-gray-400" /> Profilom
                </Link>
                <button 
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="flex items-center w-full text-left px-3 py-3 rounded-md text-base font-bold text-red-600 hover:text-red-800 hover:bg-red-50 mt-2"
                >
                  <LogOut className="w-5 h-5 mr-3" /> Kijelentkezés
                </button>
              </>
            ) : (
              // --- MOBIL: ALAPÁLLAPOT ---
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  Bejelentkezés
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-3 rounded-md text-base font-bold text-blue-600 hover:text-blue-800 hover:bg-gray-50 mt-2"
                  onClick={closeMenu}
                >
                  Regisztráció
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar