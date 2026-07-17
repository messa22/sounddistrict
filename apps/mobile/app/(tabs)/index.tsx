import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ROOMS } from "@sounddistrict/booking-core";
import { LogoHeader, PrimaryButton, RoomCard, SectionLabel } from "../../src/components";
import { colors, fonts } from "../../src/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LogoHeader right={<Pressable style={styles.avatar}><Ionicons name="person-outline" size={16} color={colors.white} /></Pressable>} />

        <ImageBackground source={require("../../assets/blueroom-new1.jpg")} resizeMode="cover" style={styles.hero}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroTop}><View style={styles.liveDot} /><Text style={styles.liveText}>Studios open · Antwerp</Text></View>
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>Built around what you make.</Text>
            <Text style={styles.heroTitle}>READY TO{`\n`}CREATE?</Text>
            <Text style={styles.heroCopy}>Choose your room. Pick a moment. Come make something real.</Text>
            <PrimaryButton label="Book a session" onPress={() => router.push({ pathname: "/book", params: { room: "blue" } })} />
          </View>
        </ImageBackground>

        <View style={styles.quickRow}>
          <View><Text style={styles.quickNumber}>3</Text><Text style={styles.quickLabel}>Unique rooms</Text></View>
          <View style={styles.quickDivider} />
          <View><Text style={styles.quickNumber}>7/7</Text><Text style={styles.quickLabel}>Bookable</Text></View>
          <View style={styles.quickDivider} />
          <View><Text style={styles.quickNumber}>2000</Text><Text style={styles.quickLabel}>Antwerp</Text></View>
        </View>

        <View style={styles.sectionHead}>
          <View><SectionLabel>Spaces</SectionLabel><Text style={styles.sectionTitle}>Choose your room.</Text></View>
          <Pressable onPress={() => router.push("/rooms")}><Text style={styles.seeAll}>See all →</Text></Pressable>
        </View>
        <RoomCard room={ROOMS[0]} compact onPress={() => router.push({ pathname: "/book", params: { room: ROOMS[0].id } })} />

        <View style={styles.upcoming}>
          <View><SectionLabel>Your district</SectionLabel><Text style={styles.upcomingTitle}>Everything around the session.</Text></View>
          <View style={styles.featureRow}><Ionicons name="flash-outline" size={21} color={colors.gold} /><View><Text style={styles.featureTitle}>Book again in seconds</Text><Text style={styles.featureCopy}>Your favorite room and extras stay close.</Text></View></View>
          <View style={styles.featureRow}><Ionicons name="calendar-outline" size={21} color={colors.gold} /><View><Text style={styles.featureTitle}>One clear overview</Text><Text style={styles.featureCopy}>Time, room, reference and status together.</Text></View></View>
          <View style={styles.featureRow}><Ionicons name="notifications-outline" size={21} color={colors.gold} /><View><Text style={styles.featureTitle}>Stay in the loop</Text><Text style={styles.featureCopy}>Session updates without searching through DMs.</Text></View></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { paddingHorizontal: 18, paddingBottom: 38 },
  avatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  hero: { height: 555, marginHorizontal: -18, justifyContent: "flex-end" },
  heroOverlay: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.4)" },
  heroTop: { position: "absolute", top: 22, left: 22, height: 30, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(0,0,0,0.68)" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  liveText: { color: colors.soft, fontSize: 8, fontWeight: "800", letterSpacing: 0.9, textTransform: "uppercase" },
  heroContent: { padding: 24, paddingTop: 100, backgroundColor: "rgba(0,0,0,0.62)" },
  heroEyebrow: { color: colors.gold, fontSize: 9, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase" },
  heroTitle: { marginTop: 12, color: colors.white, fontFamily: fonts.display, fontSize: 64, fontWeight: "900", lineHeight: 58, letterSpacing: -2.6 },
  heroCopy: { maxWidth: 310, marginTop: 15, marginBottom: 25, color: colors.soft, fontSize: 13, lineHeight: 20 },
  quickRow: { minHeight: 92, marginBottom: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderBottomWidth: 1, borderBottomColor: colors.line },
  quickNumber: { color: colors.white, fontFamily: fonts.display, fontSize: 21, fontWeight: "800", textAlign: "center" },
  quickLabel: { marginTop: 4, color: colors.muted, fontSize: 7, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
  quickDivider: { width: 1, height: 28, backgroundColor: colors.line },
  sectionHead: { marginBottom: 20, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  sectionTitle: { color: colors.white, fontFamily: fonts.display, fontSize: 34, fontWeight: "800", letterSpacing: -1.2 },
  seeAll: { marginBottom: 6, color: colors.gold, fontSize: 9, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  upcoming: { marginTop: 42, paddingTop: 38, borderTopWidth: 1, borderTopColor: colors.line },
  upcomingTitle: { maxWidth: 330, marginBottom: 30, color: colors.white, fontFamily: fonts.display, fontSize: 39, fontWeight: "800", lineHeight: 40, letterSpacing: -1.4 },
  featureRow: { minHeight: 82, flexDirection: "row", alignItems: "center", gap: 17, borderTopWidth: 1, borderTopColor: colors.line },
  featureTitle: { color: colors.white, fontSize: 13, fontWeight: "700" },
  featureCopy: { marginTop: 5, color: colors.muted, fontSize: 10 }
});
