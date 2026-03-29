import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { loginUser } from "../data/authService"
import type { Bejelentkezes } from "../data/authService"

function Login() {

  const [email,setEmail] = useState<string>("")
  const [jelszo,setJelszo] = useState<string>("")
    const navigate = useNavigate()
  const { mutate: bejelentkezes } = useMutation({

    mutationFn: (data: Bejelentkezes) => loginUser(data),

    onSuccess(){
      alert("Sikeres bejelentkezés!")
      setEmail("")
      setJelszo("")
      navigate({ to: "/" })
    },

    onError(){
      alert("Hibás email vagy jelszó")
    }

  })

  const loginHandler = () => {

    const bejelentkezesAdat: Bejelentkezes = {
      email: email,
      jelszo: jelszo
    }

    bejelentkezes(bejelentkezesAdat)

  }

  return (

    <div className="container mt-5" style={{maxWidth:"400px"}}>

      <h2 className="mb-4 text-center">Bejelentkezés</h2>

      <input
        className="form-control mb-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="Jelszó"
        value={jelszo}
        onChange={(e)=>setJelszo(e.target.value)}
      />

      <button
        className="btn btn-success w-100"
        onClick={loginHandler}
      >
        Bejelentkezés
      </button>

    </div>

  )

}

export default Login