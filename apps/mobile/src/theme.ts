import { Platform } from "react-native";

export const colors = {
  ink: "#020304",
  panel: "#0D0F10",
  panelRaised: "#151719",
  gold: "#C8A955",
  goldLight: "#E2C56E",
  white: "#FFFFFF",
  muted: "#8C8F92",
  soft: "#D7D8DB",
  line: "rgba(255,255,255,0.12)",
  success: "#6BD486",
  danger: "#FF5C53"
} as const;

export const fonts = {
  display: Platform.select({ ios: "Avenir Next Condensed", android: "sans-serif-condensed", default: "sans-serif" }),
  body: Platform.select({ ios: "Inter", android: "sans-serif", default: "sans-serif" })
} as const;

export const storageKeys = {
  bookings: "sounddistrict-mobile-bookings"
} as const;
