import axios from "axios";
import { z } from "zod";

const API_URL = "http://localhost:4000/felhasznalok";

export const registerSchema = z.object({
  felhasznalonev: z.string().min(3, { message: "Legalább 3 karakter hosszú legyen!" }),
  email: z.string().min(1, { message: "Kötelező mező!" }).email({ message: "Hibás email formátum!" }),
  jelszo: z.string().min(6, { message: "A jelszónak legalább 6 karakternek kell lennie!" }),
  telepules: z.string().min(2, { message: "Add meg a települést!" }),
  iranyitoszam: z.coerce.number({ message: "Kötelező számot megadni!" }).min(1000, { message: "Érvénytelen irányítószám!" })
});

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Az email megadása kötelező!" }).email({ message: "Érvénytelen email formátum!" }),
  jelszo: z.string().min(1, { message: "A jelszó megadása kötelező!" })
});

export type Regisztracio = z.infer<typeof registerSchema>;
export type Bejelentkezes = z.infer<typeof loginSchema>;

export const registerUser = async (data: Regisztracio) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const loginUser = async (data: Bejelentkezes) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

