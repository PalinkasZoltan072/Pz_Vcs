import { createRootRoute, Outlet } from "@tanstack/react-router"
import Navbar from "../components/Navbar"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}