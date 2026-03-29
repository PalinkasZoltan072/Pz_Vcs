import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { registerUser, registerSchema } from "../data/authService"
import type { Regisztracio } from "../data/authService"

// Shadcn UI importok
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Register() {
const navigate = useNavigate()

const form = useForm<Regisztracio>({
resolver: zodResolver(registerSchema),
defaultValues: {
felhasznalonev: "",
email: "",
jelszo: "",
telepules: "",
iranyitoszam: undefined
}
})

const { mutate: regisztracio, isPending } = useMutation({
mutationFn: (data: Regisztracio) => registerUser(data),
onSuccess() {
alert("Sikeres regisztráció!")
navigate({ to: "/login" })
},
onError(error: any) {
alert(error.response?.data?.message || "Hiba történt a regisztráció során")
}
})

const onSubmit = (data: Regisztracio) => {
regisztracio(data)
}

return (
<div className="flex items-center justify-center min-h-[80vh] px-4 my-8">
<div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-xl shadow-sm">
<h2 className="text-2xl font-bold text-center text-gray-900">Regisztráció</h2>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          control={form.control}
          name="felhasznalonev"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Felhasználónév</FormLabel>
              <FormControl>
                <Input placeholder="felhasznalo123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="pelda@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jelszo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jelszó</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telepules"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Település</FormLabel>
                <FormControl>
                  <Input placeholder="Budapest" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iranyitoszam"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Irányítószám</FormLabel>
                <FormControl>
                  {/* A onChange itt automatikusan Number-ré alakítja a beírt értéket */}
                  <Input 
                    type="number" 
                    placeholder="1000" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full mt-6">
          {isPending ? "Feldolgozás..." : "Regisztráció"}
        </Button>

      </form>
    </Form>
  </div>
</div>

)
}

export default Register