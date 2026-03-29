import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../data/authService"
import type { Regisztracio } from "../data/authService"
import { useNavigate } from "@tanstack/react-router"

function Register() {

    const [felhasznalonev,setFelhasznalonev] = useState("")
    const [email,setEmail] = useState("")
    const [jelszo,setJelszo] = useState("")
    const [telepules,setTelepules] = useState("")
    const [iranyitoszam,setIranyitoszam] = useState(0)

    const navigate = useNavigate()

  const { mutate: regisztracio } = useMutation({
    mutationFn: (data: Regisztracio) => registerUser(data),

    onSuccess(){
      alert("Sikeres regisztráció!")
      setFelhasznalonev("")
      setEmail("")
      setJelszo("")
      setTelepules("")
      setIranyitoszam(0)
      
        navigate({
          to: "/login"
        })
      
    },

    onError(error:any){
        console.log(error.response.data)
        alert(error.response.data.message || "Hiba")
      }
  })

  const registerHandler = () => {

    const ujRegisztracio: Regisztracio = {
        
            email: email,
            felhasznalonev: felhasznalonev,
            jelszo: jelszo,
            telepules: telepules,
            iranyitoszam: iranyitoszam
          
        
          
    }
    regisztracio(ujRegisztracio)


  }

  return (

    <div className="container mt-5" style={{maxWidth:"400px"}}>
  
      <h2 className="mb-4 text-center">Regisztráció</h2>
  
      <input
        className="form-control mb-3"
        type="text"
        placeholder="Felhasználónév"
        value={felhasznalonev}
        onChange={(e)=>setFelhasznalonev(e.target.value)}
      />
  
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
  
      <input
        className="form-control mb-3"
        type="text"
        placeholder="Település"
        value={telepules}
        onChange={(e)=>setTelepules(e.target.value)}
      />
  
      <input
        className="form-control mb-3"
        type="number"
        placeholder="Irányítószám"
        value={iranyitoszam}
        onChange={(e)=>setIranyitoszam(Number(e.target.value))}
      />
  
      <button
        className="btn btn-primary w-100"
        onClick={registerHandler}
      >
        Regisztráció
      </button>
  
    </div>
  
  )
}

export default Register