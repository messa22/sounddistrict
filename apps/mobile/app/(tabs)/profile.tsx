import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { LogoHeader, SectionLabel } from "../../src/components";
import { colors, fonts } from "../../src/theme";

const items = [
  { icon: "person-outline", label: "Personal details", value: "Complete your profile" },
  { icon: "notifications-outline", label: "Notifications", value: "Session updates" },
  { icon: "card-outline", label: "Payment methods", value: "Not configured" },
  { icon: "shield-checkmark-outline", label: "Privacy & terms", value: "Read policies" }
] as const;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LogoHeader />
        <View style={styles.heading}><SectionLabel>Account</SectionLabel><Text style={styles.title}>YOUR DISTRICT.</Text><Text style={styles.copy}>Keep your details ready for faster bookings and clear session updates.</Text></View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}><Ionicons name="person-outline" size={27} color={colors.gold} /></View>
          <View><Text style={styles.guest}>Guest creator</Text><Text style={styles.signIn}>Profile setup in production version</Text></View>
        </View>

        <View style={styles.list}>
          {items.map((item) => (
            <Pressable key={item.label} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
              <View style={styles.rowIcon}><Ionicons name={item.icon} size={19} color={colors.gold} /></View>
              <View style={styles.rowCopy}><Text style={styles.rowLabel}>{item.label}</Text><Text style={styles.rowValue}>{item.value}</Text></View>
              <Ionicons name="chevron-forward" size={17} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        <View style={styles.contact}>
          <SectionLabel>Need help?</SectionLabel>
          <Text style={styles.contactTitle}>Talk to the team.</Text>
          <Text style={styles.contactCopy}>Questions about a room, group session or custom project?</Text>
          <Pressable onPress={() => Linking.openURL("mailto:team@sounddistrict.be")} style={styles.contactButton}><Text style={styles.contactButtonText}>team@sounddistrict.be</Text><Text style={styles.contactButtonText}>↗</Text></Pressable>
          <Text style={styles.address}>Stadswaag 20 · 2000 Antwerpen</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { paddingHorizontal: 18, paddingBottom: 40 },
  heading: { paddingTop: 45, paddingBottom: 32 },
  title: { color: colors.white, fontFamily: fonts.display, fontSize: 50, fontWeight: "900", letterSpacing: -2 },
  copy: { maxWidth: 330, marginTop: 12, color: colors.muted, fontSize: 12, lineHeight: 19 },
  profileCard: { minHeight: 108, padding: 18, flexDirection: "row", alignItems: "center", gap: 17, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  avatar: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center", backgroundColor: colors.panelRaised },
  guest: { color: colors.white, fontFamily: fonts.display, fontSize: 20, fontWeight: "800" },
  signIn: { marginTop: 5, color: colors.muted, fontSize: 9 },
  list: { marginTop: 18, borderTopWidth: 1, borderTopColor: colors.line },
  row: { minHeight: 76, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.line },
  pressed: { opacity: 0.6 },
  rowIcon: { width: 42 },
  rowCopy: { flex: 1 },
  rowLabel: { color: colors.white, fontSize: 12, fontWeight: "700" },
  rowValue: { marginTop: 4, color: colors.muted, fontSize: 9 },
  contact: { marginTop: 55, padding: 25, backgroundColor: colors.gold },
  contactTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 31, fontWeight: "900" },
  contactCopy: { marginTop: 10, color: "rgba(0,0,0,0.65)", fontSize: 11, lineHeight: 17 },
  contactButton: { height: 50, marginTop: 22, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.ink },
  contactButtonText: { color: colors.white, fontSize: 9, fontWeight: "800", textTransform: "uppercase" },
  address: { marginTop: 15, color: "rgba(0,0,0,0.65)", fontSize: 9, textTransform: "uppercase" }
});
