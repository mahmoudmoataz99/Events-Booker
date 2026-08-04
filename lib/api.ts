import axios from "axios";

// Same backend used by the original web app
export const API_BASE_URL = "https://tickets-books.vercel.app";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  categories: string[];
  date: string;
  time?: string;
  location: string;
  price: number;
  imageUrl?: string;
  image?: string;
  availableTickets: number;
  availableSeats?: number;
}

export interface Booking {
  _id: string;
  eventId: EventItem;
  date: string;
  time: string;
  location: string;
  seats: number;
  price: number;
  status: "confirmed" | "cancelled" | string;
}

export interface AppUser {
  id: string;
  name?: string;
  username?: string;
  email: string;
  role: "admin" | "user" | string;
}
