import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <h1>CipőBolt Webshop</h1>
      <p>Itt lesznek majd a termékek</p>
    </div>
  )
}