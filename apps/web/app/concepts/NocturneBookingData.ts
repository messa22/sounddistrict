import type { RoomId } from "@sounddistrict/booking-core";

export type NocturneOfferId =
  | "studio-hourly"
  | "with-producer"
  | "six-hour"
  | "ten-hour"
  | "white-hourly"
  | "white-three"
  | "white-five";

export type NocturneBookingOffer = {
  id: NocturneOfferId;
  name: string;
  description: string;
  defaultDuration: number;
  durationOptions?: readonly number[];
  durationPrices?: Readonly<Partial<Record<number, number>>>;
  pricePerHour?: number;
  fixedPrice?: number;
  standardPrice?: number;
  valuePrice?: number;
  promoLabel?: string;
  badge?: string;
};

export const NOCTURNE_BOOKING_OFFERS: Record<RoomId, readonly NocturneBookingOffer[]> = {
  blue: [
    {
      id: "studio-hourly",
      name: "Studio only",
      description: "Book the studio by the hour.",
      defaultDuration: 2,
      durationOptions: [1, 2, 3, 4, 5, 6, 7, 8],
      durationPrices: { 6: 150 },
      pricePerHour: 30
    },
    {
      id: "with-producer",
      name: "With producer",
      description: "Studio time with a producer throughout your session.",
      defaultDuration: 2,
      durationOptions: [1, 2, 3, 4, 5, 6, 7, 8],
      pricePerHour: 50
    },
    {
      id: "six-hour",
      name: "6-hour session",
      description: "Book 5 hours and get 1 hour free.",
      defaultDuration: 6,
      fixedPrice: 150,
      standardPrice: 180,
      badge: "1h free"
    },
    {
      id: "ten-hour",
      name: "10-hour session",
      description: "Book 8 hours and get 2 hours free.",
      defaultDuration: 10,
      fixedPrice: 240,
      standardPrice: 300,
      badge: "2h free"
    }
  ],
  red: [
    {
      id: "studio-hourly",
      name: "Studio only",
      description: "Book the studio by the hour.",
      defaultDuration: 2,
      durationOptions: [1, 2, 3, 4, 5, 6, 7, 8],
      durationPrices: { 6: 125 },
      pricePerHour: 25
    },
    {
      id: "with-producer",
      name: "With producer",
      description: "Studio time with a producer throughout your session.",
      defaultDuration: 2,
      durationOptions: [1, 2, 3, 4, 5, 6, 7, 8],
      pricePerHour: 45
    },
    {
      id: "six-hour",
      name: "6-hour session",
      description: "Book 5 hours and get 1 hour free.",
      defaultDuration: 6,
      fixedPrice: 125,
      standardPrice: 150,
      badge: "1h free"
    },
    {
      id: "ten-hour",
      name: "10-hour session",
      description: "Book 8 hours and get 2 hours free.",
      defaultDuration: 10,
      fixedPrice: 200,
      standardPrice: 250,
      badge: "2h free"
    }
  ],
  infinity: [
    {
      id: "white-hourly",
      name: "Studio by the hour",
      description: "Opening-month rate for a flexible visual session.",
      defaultDuration: 1,
      durationOptions: [1, 2, 3, 4, 5, 6, 7, 8],
      durationPrices: { 3: 120, 5: 200 },
      pricePerHour: 50,
      standardPrice: 60,
      promoLabel: "Opening month"
    },
    {
      id: "white-three",
      name: "3-hour package",
      description: "Opening-month package for a focused shoot.",
      defaultDuration: 3,
      fixedPrice: 120,
      standardPrice: 150,
      valuePrice: 180,
      promoLabel: "Opening month"
    },
    {
      id: "white-five",
      name: "5-hour package",
      description: "Opening-month package for a larger production.",
      defaultDuration: 5,
      fixedPrice: 200,
      standardPrice: 250,
      valuePrice: 300,
      promoLabel: "Opening month"
    }
  ]
};

export function getNocturneOffers(roomId: RoomId): readonly NocturneBookingOffer[] {
  return NOCTURNE_BOOKING_OFFERS[roomId];
}

export function getNocturneOffer(
  roomId: RoomId,
  offerId?: string | null
): NocturneBookingOffer {
  const offers = getNocturneOffers(roomId);
  return offers.find((offer) => offer.id === offerId) ?? offers[0];
}

export function calculateNocturnePrice(
  offer: NocturneBookingOffer,
  duration: number
): number {
  return offer.durationPrices?.[duration]
    ?? offer.fixedPrice
    ?? (offer.pricePerHour ?? 0) * duration;
}

export function calculateNocturneStandardPrice(
  offer: NocturneBookingOffer,
  duration: number
): number | undefined {
  if (offer.fixedPrice !== undefined) return offer.standardPrice;
  if (offer.standardPrice !== undefined && offer.pricePerHour !== undefined) {
    return offer.standardPrice * duration;
  }
  if (offer.durationPrices?.[duration] !== undefined && offer.pricePerHour !== undefined) {
    return offer.pricePerHour * duration;
  }
  return undefined;
}
