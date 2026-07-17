import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ROOMS } from "@sounddistrict/booking-core";
import { LogoHeader, RoomCard, SectionLabel } from "../../src/components";
import { colors, fonts } from "../../src/theme";

export default function RoomsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LogoHeader />
        <View style={styles.heading}>
          <SectionLabel>01 · Spaces</SectionLabel>
          <Text style={styles.title}>ONE HUB.{`\n`}THREE ROOMS.</Text>
          <Text style={styles.copy}>Every room has its own energy. The same focus: making better work.</Text>
        </View>
        {ROOMS.map((room) => <RoomCard room={room} key={room.id} onPress={() => router.push({ pathname: "/book", params: { room: room.id } })} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { paddingHorizontal: 18, paddingBottom: 35 },
  heading: { paddingTop: 45, paddingBottom: 38 },
  title: { color: colors.white, fontFamily: fonts.display, fontSize: 53, fontWeight: "900", lineHeight: 49, letterSpacing: -2 },
  copy: { maxWidth: 330, marginTop: 18, color: colors.muted, fontSize: 13, lineHeight: 21 }
});
