import axios from "axios";

const API_URL = "http://localhost:4000/felhasznalok";

export type Regisztracio = {
    email: string
  felhasznalonev: string
  jelszo: string
  telepules: string
  iranyitoszam: number
  }
  
  export type Bejelentkezes = {
    email: string
    jelszo: string
  }
  
export const registerUser = async (data: any) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const loginUser = async (data: any) => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
};