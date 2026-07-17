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
    name: "Blue Room",
    eyebrow: "Studio 01 · Hip-hop",
    description: "Immersive sound, fluid energy. Clean acoustics in an underwater atmosphere.",
    pricePerHour: 55,
    image: "blueroom-new1.jpg",
    accent: "#3C72FF",
    features: ["Recording booth", "Engineer optioneel", "Tot 5 personen"]
  },
  {
    id: "red",
    name: "Red Room",
    eyebrow: "Studio 02 · Recording",
    description: "Warmer tones and deeper character for artists outside the standard lane.",
    pricePerHour: 65,
    image: "space2-new.jpg",
    accent: "#FF4B3E",
    features: ["Vocal chain", "Producer setup", "Tot 6 personen"]
  },
  {
    id: "infinity",
    name: "Infinity Room",
    eyebrow: "Studio 03 · Visuals",
    description: "A flexible infinity space for content, campaigns, covers and live sessions.",
    pricePerHour: 75,
    image: "Untitled-2.jpg",
    accent: "#C8A955",
    features: ["Infinity wall", "Basisbelichting", "Tot 10 personen"]
  }
];

export const ADD_ONS: AddOn[] = [
  {
    id: "engineer",
    name: "Sound engineer",
    description: "Technische begeleiding tijdens je volledige sessie.",
    price: 35
  },
  {
    id: "mix",
    name: "Quick mix",
    description: "Een nette rough mix om meteen mee naar huis te nemen.",
    price: 45
  },
  {
    id: "content",
    name: "Content clip",
    description: "Een verticale behind-the-scenes clip van je sessie.",
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
  return new Intl.NumberFormat("nl-BE", {
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
