import type { PropsWithChildren } from "react";
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import type { Room } from "@sounddistrict/booking-core";
import { formatCurrency } from "@sounddistrict/booking-core";
import { colors, fonts } from "./theme";
import { roomImages } from "./images";

export function LogoHeader({ right }: { right?: React.ReactNode }) {
  return (
    <View style={styles.logoHeader}>
      <Image source={require("../assets/new-logo2.png")} resizeMode="contain" style={styles.logo} />
      {right}
    </View>
  );
}

export function SectionLabel({ children }: PropsWithChildren) {
  return <Text style={styles.sectionLabel}>— {children}</Text>;
}

export function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, disabled && styles.disabled]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      <Text style={styles.primaryButtonArrow}>→</Text>
    </Pressable>
  );
}

export function RoomCard({ room, onPress, compact = false }: { room: Room; onPress: () => void; compact?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.roomCard, compact && styles.roomCardCompact, pressed && styles.pressed]}>
      <ImageBackground source={roomImages[room.id]} resizeMode="cover" style={styles.roomImage} imageStyle={styles.roomImageRadius}>
        <View style={styles.roomOverlay} />
        <View style={styles.availability}><View style={styles.availabilityDot} /><Text style={styles.availabilityText}>Available today</Text></View>
        <View style={styles.roomInfo}>
          <Text style={[styles.roomEyebrow, { color: room.accent }]}>{room.eyebrow}</Text>
          <Text style={styles.roomName}>{room.name}</Text>
          {!compact && <Text style={styles.roomDescription}>{room.description}</Text>}
          <Text style={styles.roomPrice}>From {formatCurrency(room.pricePerHour)} / hour</Text>
        </View>
        <View style={styles.roomArrow}><Text style={styles.roomArrowText}>↗</Text></View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoHeader: { height: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { width: 168, height: 27 },
  sectionLabel: { marginBottom: 16, color: colors.gold, fontSize: 10, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase" },
  primaryButton: { height: 56, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.gold },
  primaryButtonText: { color: colors.ink, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  primaryButtonArrow: { color: colors.ink, fontSize: 20 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.4 },
  roomCard: { height: 395, marginBottom: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  roomCardCompact: { height: 305 },
  roomImage: { flex: 1, justifyContent: "flex-end" },
  roomImageRadius: { borderRadius: 0 },
  roomOverlay: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.25)" },
  availability: { position: "absolute", top: 16, right: 16, paddingHorizontal: 10, height: 28, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "rgba(0,0,0,0.75)" },
  availabilityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  availabilityText: { color: colors.soft, fontSize: 8, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" },
  roomInfo: { padding: 22, paddingTop: 85, backgroundColor: "rgba(0,0,0,0.62)" },
  roomEyebrow: { marginBottom: 7, fontSize: 9, fontWeight: "800", letterSpacing: 1.1, textTransform: "uppercase" },
  roomName: { color: colors.white, fontFamily: fonts.display, fontSize: 37, fontWeight: "800", letterSpacing: -1.2 },
  roomDescription: { marginTop: 7, color: colors.soft, fontSize: 12, lineHeight: 18 },
  roomPrice: { marginTop: 12, color: colors.soft, fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  roomArrow: { position: "absolute", right: 19, bottom: 22, width: 36, height: 36, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", borderRadius: 18 },
  roomArrowText: { color: colors.white, fontSize: 17 }
});
