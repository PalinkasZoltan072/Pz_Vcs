import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from '../context/AuthContext'
import { loginUser, loginSchema } from "../data/authService"
import type { Bejelentkezes } from "../data/authService"

// Shadcn UI importok
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()


  // React Hook Form beállítása a Shadcn számára
  const form = useForm<Bejelentkezes>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      jelszo: ""
    }
  })

  const { mutate: bejelentkezes, isPending } = useMutation({
    mutationFn: (data: Bejelentkezes) => loginUser(data),
    onSuccess(data) {
      login(data.token)
      alert("Sikeres bejelentkezés!")
      navigate({ to: "/" })
    },
    onError() {
      alert("Hibás email vagy jelszó!")
    }
  })

  const onSubmit = (data: Bejelentkezes) => {
    bejelentkezes(data)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-center text-gray-900">Bejelentkezés</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="pelda@email.com" {...field} />
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

            <Button type="submit" disabled={isPending} className="w-full mt-6">
              {isPending ? "Bejelentkezés folyamatban..." : "Bejelentkezés"}
            </Button>

          </form>
        </Form>
      </div>
    </div>

  )
}

export default Login