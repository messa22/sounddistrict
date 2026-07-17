import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { formatCurrency, getRoom, type StoredBooking } from "@sounddistrict/booking-core";
import { LogoHeader, PrimaryButton, SectionLabel } from "../../src/components";
import { colors, fonts, storageKeys } from "../../src/theme";

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem(storageKeys.bookings).then((raw) => {
      setBookings(raw ? JSON.parse(raw) as StoredBooking[] : []);
      setLoaded(true);
    });
  }, []));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LogoHeader />
        <View style={styles.heading}><SectionLabel>Your sessions</SectionLabel><Text style={styles.title}>KEEP TRACK.{`\n`}KEEP CREATING.</Text></View>

        {loaded && bookings.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><Ionicons name="calendar-outline" size={30} color={colors.gold} /></View>
            <Text style={styles.emptyTitle}>No sessions yet.</Text>
            <Text style={styles.emptyCopy}>Your booked rooms, timing and references will appear here.</Text>
            <PrimaryButton label="Book your first session" onPress={() => router.push({ pathname: "/book", params: { room: "blue" } })} />
          </View>
        )}

        {bookings.map((booking) => {
          const room = getRoom(booking.roomId);
          const sessionDate = new Intl.DateTimeFormat("nl-BE", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${booking.date}T12:00:00`));
          return (
            <View style={styles.bookingCard} key={booking.reference}>
              <View style={styles.cardTop}>
                <View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>Awaiting confirmation</Text></View>
                <Text style={styles.reference}>{booking.reference}</Text>
              </View>
              <Text style={styles.roomName}>{room.name}</Text>
              <View style={styles.details}>
                <View><Ionicons name="calendar-outline" size={15} color={colors.gold} /><Text style={styles.detailValue}>{sessionDate}</Text></View>
                <View><Ionicons name="time-outline" size={15} color={colors.gold} /><Text style={styles.detailValue}>{booking.time} · {booking.duration}h</Text></View>
                <View><Ionicons name="receipt-outline" size={15} color={colors.gold} /><Text style={styles.detailValue}>{formatCurrency(booking.total)}</Text></View>
              </View>
              <Pressable onPress={() => router.push({ pathname: "/book", params: { room: booking.roomId } })} style={styles.rebook}><Text style={styles.rebookText}>Book this room again</Text><Text style={styles.rebookText}>→</Text></Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { paddingHorizontal: 18, paddingBottom: 38 },
  heading: { paddingTop: 45, paddingBottom: 38 },
  title: { color: colors.white, fontFamily: fonts.display, fontSize: 49, fontWeight: "900", lineHeight: 46, letterSpacing: -1.9 },
  empty: { minHeight: 450, padding: 30, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  emptyIcon: { width: 68, height: 68, marginBottom: 22, alignItems: "center", justifyContent: "center", borderRadius: 34, borderWidth: 1, borderColor: colors.line },
  emptyTitle: { color: colors.white, fontFamily: fonts.display, fontSize: 29, fontWeight: "800" },
  emptyCopy: { maxWidth: 280, marginTop: 10, marginBottom: 25, color: colors.muted, fontSize: 11, lineHeight: 18, textAlign: "center" },
  bookingCard: { marginBottom: 14, padding: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  status: { flexDirection: "row", alignItems: "center", gap: 7 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  statusText: { color: colors.gold, fontSize: 8, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  reference: { color: colors.muted, fontSize: 8 },
  roomName: { marginTop: 22, color: colors.white, fontFamily: fonts.display, fontSize: 34, fontWeight: "800" },
  details: { marginTop: 20, paddingVertical: 17, flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  detailValue: { marginTop: 7, color: colors.soft, fontSize: 9 },
  rebook: { height: 48, marginTop: 18, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.gold },
  rebookText: { color: colors.ink, fontSize: 9, fontWeight: "900", textTransform: "uppercase" }
});
