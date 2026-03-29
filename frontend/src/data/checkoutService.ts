import axios from "axios";

const API_URL = "http://localhost:4000";

export type Felhasznalo = {
  id: number;
  felhasznalonev: string;
  email: string;
  telepules: string;
  iranyitoszam: number;
};

export type RendelesPayload = {
  cipoId: number;
  mennyiseg: number;
  fizetes: "kártyával" | "utánvéttel";
  meret: number;
};

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Token-ből kinyerjük az id-t (JWT payload base64 decode)
export const getTokenPayload = (): { id: number; role: string } | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

export const getFelhasznalo = async (id: number): Promise<Felhasznalo> => {
  const response = await axios.get(
    `${API_URL}/felhasznalok/${id}`,
    getAuthHeader()
  );
  return response.data;
};

export const createRendeles = async (
  payload: RendelesPayload
): Promise<void> => {
  await axios.post(`${API_URL}/rendelesek`, payload, getAuthHeader());
};

// --- ÚJ FÜGGVÉNY A PROFIL OLDALHOZ ---
export const getFelhasznaloRendelesek = async (userId: number) => {
  const response = await axios.get(
    `${API_URL}/rendelesek?felhasznaloId=${userId}`,
    getAuthHeader()
  );
  return response.data;
};
// --- ÚJ FÜGGVÉNY A CÍM FRISSÍTÉSÉHEZ ---
export const updateFelhasznaloCim = async (userId: number, telepules: string): Promise<void> => {
  await axios.patch(
    `${API_URL}/felhasznalok/${userId}`,
    { telepules },
    getAuthHeader()
  );
};