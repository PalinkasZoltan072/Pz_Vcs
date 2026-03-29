import { useNavigate } from "@tanstack/react-router"

function Navbar() {

  const navigate = useNavigate()

  return (
    <nav style={{display:"flex", justifyContent:"space-between", padding:"20px"}}>

      <h2>CipőBolt</h2>

      <div>

        <button
          onClick={() => navigate({ to: "/login" })}
        >
          Bejelentkezés
        </button>

        <button
          onClick={() => navigate({ to: "/register" })}
        >
          Regisztráció
        </button>

      </div>

    </nav>
  )
}

export default Navbar