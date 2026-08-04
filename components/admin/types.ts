export interface Category {
  _id: string;
  name: string;
}

export interface AdminEvent {
  _id?: string;
  name: string;
  description: string;
  categories: string[];
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  availableSeats: string;
}

export const emptyEventForm: AdminEvent = {
  name: "",
  description: "",
  categories: [],
  date: "",
  time: "",
  location: "",
  price: "",
  image: "",
  availableSeats: "",
};
