import axios from "axios";

const API_URL = "http://localhost:4000/cipok";

export type Cipo = {
  id: number;
  marka: string;
  nev: string; 
  ar: number;
  kepek?: { url: string }[];
  Meretek?: { meret: number }[]; // FIGYELD A NAGY 'M'-ET!
};

export type CipoFilters = {
  marka?: string;
  minAr?: number;
  maxAr?: number;
  meret?: number;
};

export const getCipok = async (filters?: CipoFilters): Promise<Cipo[]> => {
  const response = await axios.get(API_URL, { params: filters });
  return response.data;
};

export const getCipoById = async (id: number): Promise<Cipo> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};