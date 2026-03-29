import { createRootRoute, Outlet } from "@tanstack/react-router"
import Navbar from "../components/Navbar"
import { CartProvider } from "@/context/cartContext"
import { AuthProvider } from "@/context/AuthContext"
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <AuthProvider>
      <CartProvider> 
        <div className="min-h-screen bg-white">
          <Navbar />
          <Outlet />
        </div>
      </CartProvider>
    </AuthProvider>
  )
} 