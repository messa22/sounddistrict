export type RoomId = "blue" | "red" | "infinity";

export type Room = {
  id: RoomId;
  name: string;
  eyebrow: string;
  description: string;
  pricePerHour: number;
  image: string;
  accent: string;
  features: string[];
};

export type AddOn = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type BookingDraft = {
  roomId: RoomId;
  date: string;
  time: string;
  duration: number;
  addOnIds: string[];
  name: string;
  email: string;
  phone?: string;
  note?: string;
};

export type StoredBooking = BookingDraft & {
  reference: string;
  total: number;
  createdAt: string;
  status: "pending" | "confirmed";
};

export const ROOMS: Room[] = [
  {
    id: "blue",
    name: "Blue District",
    eyebrow: "District 01 · Recording",
    description: "XL, high end, modern music studio with an underwater touch.",
    pricePerHour: 55,
    image: "blueroom-new1.jpg",
    accent: "#3C72FF",
    features: ["XL studio", "Sound engineer optional", "Up to 5 people"]
  },
  {
    id: "red",
    name: "2000’s District",
    eyebrow: "District 02 · Recording",
    description: "high end, retro, warm music studio with a separate booth",
    pricePerHour: 65,
    image: "space2-new.jpg",
    accent: "#FF4B3E",
    features: ["Separate booth", "Producer setup", "Up to 6 people"]
  },
  {
    id: "infinity",
    name: "White District",
    eyebrow: "District 03 · Visuals",
    description: "endless, white, clean photo studio for creators",
    pricePerHour: 75,
    image: "Untitled-2.jpg",
    accent: "#C8A955",
    features: ["Infinity wall", "Basic lighting", "Up to 10 people"]
  }
];

export const ADD_ONS: AddOn[] = [
  {
    id: "engineer",
    name: "Sound engineer",
    description: "Technical support throughout your session.",
    price: 35
  },
  {
    id: "mix",
    name: "Quick mix",
    description: "A polished rough mix to take with you immediately.",
    price: 45
  },
  {
    id: "content",
    name: "Content clip",
    description: "A vertical behind-the-scenes clip from your session.",
    price: 60
  }
];

export const TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

export function getRoom(roomId: RoomId): Room {
  return ROOMS.find((room) => room.id === roomId) ?? ROOMS[0];
}

export function calculateQuote(roomId: RoomId, duration: number, addOnIds: string[]): number {
  const room = getRoom(roomId);
  const addOns = ADD_ONS.filter((addOn) => addOnIds.includes(addOn.id));
  return room.pricePerHour * duration + addOns.reduce((total, addOn) => total + addOn.price, 0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

export function buildBookingReference(now = new Date()): string {
  const stamp = now.toISOString().slice(2, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SD-${stamp}-${suffix}`;
}
