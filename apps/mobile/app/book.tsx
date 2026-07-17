import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  ADD_ONS,
  ROOMS,
  TIME_SLOTS,
  buildBookingReference,
  calculateQuote,
  formatCurrency,
  getRoom,
  type RoomId,
  type StoredBooking
} from "@sounddistrict/booking-core";
import { roomImages } from "../src/images";
import { colors, fonts, storageKeys } from "../src/theme";

const stepNames = ["Room", "Moment", "Extras", "Details", "Check"];

function getNextDates() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    const year = date.getFullYear();
    const monthNumber = String(date.getMonth() + 1).padStart(2, "0");
    const dayNumber = String(date.getDate()).padStart(2, "0");
    return {
      value: `${year}-${monthNumber}-${dayNumber}`,
      day: new Intl.DateTimeFormat("nl-BE", { weekday: "short" }).format(date),
      date: date.getDate().toString(),
      month: new Intl.DateTimeFormat("nl-BE", { month: "short" }).format(date)
    };
  });
}

export default function BookScreen() {
  const params = useLocalSearchParams<{ room?: string }>();
  const initialRoom = ROOMS.some((item) => item.id === params.room) ? params.room as RoomId : "blue";
  const dates = useMemo(getNextDates, []);
  const [step, setStep] = useState(0);
  const [roomId, setRoomId] = useState<RoomId>(initialRoom);
  const [date, setDate] = useState(dates[0].value);
  const [time, setTime] = useState("14:00");
  const [duration, setDuration] = useState(2);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);

  const room = getRoom(roomId);
  const total = calculateQuote(roomId, duration, addOnIds);

  function toggleAddOn(id: string) {
    setAddOnIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function canContinue() {
    if (step === 3) return name.trim().length > 1 && email.includes("@");
    return true;
  }

  async function saveBooking() {
    setSaving(true);
    const bookingReference = buildBookingReference();
    const booking: StoredBooking = {
      roomId, date, time, duration, addOnIds, name, email, note,
      reference: bookingReference,
      total,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    const raw = await AsyncStorage.getItem(storageKeys.bookings);
    const existing = raw ? JSON.parse(raw) as StoredBooking[] : [];
    await AsyncStorage.setItem(storageKeys.bookings, JSON.stringify([booking, ...existing]));
    setReference(bookingReference);
    setSaving(false);
    setStep(5);
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {step < 5 && (
        <View style={styles.progress}>
          {stepNames.map((item, index) => (
            <View style={styles.progressItem} key={item}>
              <View style={[styles.progressDot, index <= step && styles.progressDotActive]}><Text style={[styles.progressNumber, index <= step && styles.progressNumberActive]}>{index < step ? "✓" : index + 1}</Text></View>
              <Text style={[styles.progressLabel, index <= step && styles.progressLabelActive]}>{item}</Text>
              {index < stepNames.length - 1 && <View style={[styles.progressLine, index < step && styles.progressLineActive]} />}
            </View>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <View>
            <Text style={styles.eyebrow}>Step 1 · Choose your space</Text>
            <Text style={styles.title}>Which room fits your session?</Text>
            {ROOMS.map((item) => (
              <Pressable key={item.id} onPress={() => setRoomId(item.id)} style={[styles.roomOption, roomId === item.id && styles.selectedBorder]}>
                <ImageBackground source={roomImages[item.id]} style={styles.roomThumb} />
                <View style={styles.roomOptionCopy}><Text style={[styles.roomOptionEyebrow, { color: item.accent }]}>{item.eyebrow}</Text><Text style={styles.roomOptionTitle}>{item.name}</Text><Text style={styles.optionPrice}>{formatCurrency(item.pricePerHour)} / hour</Text></View>
                <View style={[styles.radio, roomId === item.id && styles.radioSelected]}>{roomId === item.id && <Ionicons name="checkmark" color={colors.ink} size={13} />}</View>
              </Pressable>
            ))}
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.eyebrow}>Step 2 · Pick a moment</Text>
            <Text style={styles.title}>When do you want to create?</Text>
            <Text style={styles.inputLabel}>Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
              {dates.map((item) => (
                <Pressable key={item.value} onPress={() => setDate(item.value)} style={[styles.dateChip, date === item.value && styles.selectedFill]}>
                  <Text style={[styles.dateDay, date === item.value && styles.selectedText]}>{item.day}</Text>
                  <Text style={[styles.dateNumber, date === item.value && styles.selectedText]}>{item.date}</Text>
                  <Text style={[styles.dateMonth, date === item.value && styles.selectedText]}>{item.month}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Text style={styles.inputLabel}>Start time</Text>
            <View style={styles.chipGrid}>{TIME_SLOTS.map((slot) => <Pressable key={slot} onPress={() => setTime(slot)} style={[styles.timeChip, time === slot && styles.selectedFill]}><Text style={[styles.chipText, time === slot && styles.selectedText]}>{slot}</Text></Pressable>)}</View>
            <Text style={styles.inputLabel}>Duration</Text>
            <View style={styles.durationRow}>{[1,2,3,4].map((hours) => <Pressable key={hours} onPress={() => setDuration(hours)} style={[styles.durationChip, duration === hours && styles.selectedFill]}><Text style={[styles.chipText, duration === hours && styles.selectedText]}>{hours}h</Text></Pressable>)}</View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.eyebrow}>Step 3 · Extra support</Text>
            <Text style={styles.title}>Make the session complete.</Text>
            <Text style={styles.intro}>Optional. You can still discuss these with the team later.</Text>
            {ADD_ONS.map((addOn) => (
              <Pressable key={addOn.id} onPress={() => toggleAddOn(addOn.id)} style={[styles.addOn, addOnIds.includes(addOn.id) && styles.selectedBorder]}>
                <View style={[styles.addIcon, addOnIds.includes(addOn.id) && styles.radioSelected]}><Text style={[styles.addIconText, addOnIds.includes(addOn.id) && styles.selectedText]}>{addOnIds.includes(addOn.id) ? "✓" : "+"}</Text></View>
                <View style={styles.addCopy}><Text style={styles.addTitle}>{addOn.name}</Text><Text style={styles.addDescription}>{addOn.description}</Text></View>
                <Text style={styles.addPrice}>+{formatCurrency(addOn.price)}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.eyebrow}>Step 4 · Your details</Text>
            <Text style={styles.title}>Who are we expecting?</Text>
            <Text style={styles.inputLabel}>Name *</Text><TextInput value={name} onChangeText={setName} placeholder="Your full name" placeholderTextColor="#666" style={styles.input} autoComplete="name" />
            <Text style={styles.inputLabel}>Email *</Text><TextInput value={email} onChangeText={setEmail} placeholder="name@email.be" placeholderTextColor="#666" style={styles.input} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            <Text style={styles.inputLabel}>What are you making?</Text><TextInput value={note} onChangeText={setNote} placeholder="Tell us about your session." placeholderTextColor="#666" style={[styles.input, styles.textArea]} multiline textAlignVertical="top" />
          </View>
        )}

        {step === 4 && (
          <View>
            <Text style={styles.eyebrow}>Step 5 · Check & confirm</Text>
            <Text style={styles.title}>Everything ready.</Text>
            <View style={styles.summary}>
              <SummaryRow label="Room" value={room.name} onEdit={() => setStep(0)} />
              <SummaryRow label="Moment" value={`${date} · ${time} · ${duration}h`} onEdit={() => setStep(1)} />
              <SummaryRow label="Extras" value={addOnIds.length ? ADD_ONS.filter((item) => addOnIds.includes(item.id)).map((item) => item.name).join(", ") : "None"} onEdit={() => setStep(2)} />
              <SummaryRow label="Contact" value={`${name} · ${email}`} onEdit={() => setStep(3)} />
            </View>
            <View style={styles.totalCard}><View><Text style={styles.totalLabel}>Estimated total</Text><Text style={styles.totalHint}>Final after team confirmation</Text></View><Text style={styles.totalValue}>{formatCurrency(total)}</Text></View>
          </View>
        )}

        {step === 5 && (
          <View style={styles.success}>
            <View style={styles.successIcon}><Ionicons name="checkmark" size={34} color={colors.ink} /></View>
            <Text style={styles.eyebrow}>Booking request ready</Text>
            <Text style={styles.successTitle}>SEE YOU IN{`\n`}THE DISTRICT.</Text>
            <Text style={styles.referenceLabel}>Reference</Text><Text style={styles.reference}>{reference}</Text>
            <View style={styles.successCard}><Text style={styles.successRoom}>{room.name}</Text><Text style={styles.successDetail}>{date} · {time} · {duration} hours</Text><Text style={styles.successDetail}>{formatCurrency(total)}</Text></View>
            <Text style={styles.prototypeNote}>Prototype: this request is stored on your device. The production app will connect it to live availability, payment and team confirmation.</Text>
            <Pressable onPress={() => router.replace("/bookings")} style={styles.doneButton}><Text style={styles.doneButtonText}>View my sessions</Text><Text style={styles.doneButtonText}>→</Text></Pressable>
          </View>
        )}
      </ScrollView>

      {step < 5 && (
        <View style={styles.footer}>
          <View><Text style={styles.footerLabel}>Estimated total</Text><Text style={styles.footerTotal}>{formatCurrency(total)}</Text></View>
          <View style={styles.footerActions}>{step > 0 && <Pressable onPress={() => setStep((current) => current - 1)} style={styles.backButton}><Text style={styles.backText}>Back</Text></Pressable>}<Pressable disabled={!canContinue() || saving} onPress={() => step === 4 ? saveBooking() : setStep((current) => current + 1)} style={[styles.nextButton, (!canContinue() || saving) && styles.disabled]}><Text style={styles.nextText}>{saving ? "Saving..." : step === 4 ? "Confirm request" : "Continue"}</Text><Text style={styles.nextText}>→</Text></Pressable></View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text><Pressable onPress={onEdit}><Text style={styles.edit}>Edit</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  progress: { height: 68, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.line },
  progressItem: { flex: 1, alignItems: "center", position: "relative" },
  progressDot: { zIndex: 2, width: 23, height: 23, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#494B4D", backgroundColor: colors.ink },
  progressDotActive: { borderColor: colors.gold, backgroundColor: colors.gold },
  progressNumber: { color: colors.muted, fontSize: 8, fontWeight: "800" },
  progressNumberActive: { color: colors.ink },
  progressLabel: { marginTop: 5, color: "#656769", fontSize: 7, fontWeight: "700", textTransform: "uppercase" },
  progressLabelActive: { color: colors.soft },
  progressLine: { position: "absolute", zIndex: 0, top: 11, left: "62%", width: "76%", height: 1, backgroundColor: "#323436" },
  progressLineActive: { backgroundColor: colors.gold },
  content: { padding: 22, paddingBottom: 130 },
  eyebrow: { marginBottom: 12, color: colors.gold, fontSize: 9, fontWeight: "900", letterSpacing: 1.4, textTransform: "uppercase" },
  title: { maxWidth: 350, marginBottom: 28, color: colors.white, fontFamily: fonts.display, fontSize: 40, fontWeight: "900", lineHeight: 40, letterSpacing: -1.5 },
  intro: { marginTop: -15, marginBottom: 25, color: colors.muted, fontSize: 12, lineHeight: 18 },
  roomOption: { minHeight: 106, marginBottom: 11, paddingRight: 15, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  selectedBorder: { borderWidth: 2, borderColor: colors.gold },
  roomThumb: { width: 105, alignSelf: "stretch" },
  roomOptionCopy: { flex: 1, paddingHorizontal: 15 },
  roomOptionEyebrow: { fontSize: 7, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  roomOptionTitle: { marginTop: 4, color: colors.white, fontFamily: fonts.display, fontSize: 23, fontWeight: "800" },
  optionPrice: { marginTop: 5, color: colors.muted, fontSize: 8, textTransform: "uppercase" },
  radio: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#555" },
  radioSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  inputLabel: { marginTop: 22, marginBottom: 10, color: colors.soft, fontSize: 9, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  dateRow: { gap: 8 },
  dateChip: { width: 64, height: 84, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  dateDay: { color: colors.muted, fontSize: 8, fontWeight: "800", textTransform: "uppercase" },
  dateNumber: { marginVertical: 3, color: colors.white, fontFamily: fonts.display, fontSize: 25, fontWeight: "800" },
  dateMonth: { color: colors.muted, fontSize: 8, textTransform: "uppercase" },
  selectedFill: { borderColor: colors.gold, backgroundColor: colors.gold },
  selectedText: { color: colors.ink },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  timeChip: { width: "31%", height: 46, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  durationRow: { flexDirection: "row", gap: 8 },
  durationChip: { flex: 1, height: 46, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  chipText: { color: colors.soft, fontSize: 11, fontWeight: "700" },
  addOn: { minHeight: 98, marginBottom: 11, padding: 15, flexDirection: "row", alignItems: "center", gap: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  addIcon: { width: 31, height: 31, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#555" },
  addIconText: { color: colors.white, fontSize: 15 },
  addCopy: { flex: 1 },
  addTitle: { color: colors.white, fontSize: 13, fontWeight: "800" },
  addDescription: { marginTop: 5, color: colors.muted, fontSize: 9, lineHeight: 14 },
  addPrice: { color: colors.gold, fontSize: 10, fontWeight: "800" },
  input: { height: 54, paddingHorizontal: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, color: colors.white, fontSize: 14 },
  textArea: { height: 120, paddingTop: 15 },
  summary: { borderTopWidth: 1, borderTopColor: colors.line },
  summaryRow: { minHeight: 78, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.line },
  summaryLabel: { width: 65, color: colors.muted, fontSize: 8, fontWeight: "800", textTransform: "uppercase" },
  summaryValue: { flex: 1, color: colors.white, fontSize: 11, fontWeight: "700" },
  edit: { color: colors.gold, fontSize: 9, textDecorationLine: "underline" },
  totalCard: { marginTop: 24, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.panelRaised },
  totalLabel: { color: colors.white, fontSize: 9, fontWeight: "800", textTransform: "uppercase" },
  totalHint: { marginTop: 5, color: colors.muted, fontSize: 8 },
  totalValue: { color: colors.white, fontFamily: fonts.display, fontSize: 27, fontWeight: "900" },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 82, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: "#090A0B" },
  footerLabel: { color: colors.muted, fontSize: 7, fontWeight: "700", textTransform: "uppercase" },
  footerTotal: { marginTop: 3, color: colors.white, fontFamily: fonts.display, fontSize: 21, fontWeight: "800" },
  footerActions: { flexDirection: "row", gap: 7 },
  backButton: { height: 50, paddingHorizontal: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.panelRaised },
  backText: { color: colors.soft, fontSize: 9, fontWeight: "800", textTransform: "uppercase" },
  nextButton: { minWidth: 142, height: 50, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 15, backgroundColor: colors.gold },
  nextText: { color: colors.ink, fontSize: 9, fontWeight: "900", textTransform: "uppercase" },
  disabled: { opacity: 0.4 },
  success: { minHeight: 650, alignItems: "center", justifyContent: "center" },
  successIcon: { width: 68, height: 68, marginBottom: 24, borderRadius: 34, alignItems: "center", justifyContent: "center", backgroundColor: colors.gold },
  successTitle: { color: colors.white, fontFamily: fonts.display, fontSize: 50, fontWeight: "900", lineHeight: 47, letterSpacing: -2, textAlign: "center" },
  referenceLabel: { marginTop: 30, color: colors.muted, fontSize: 8, fontWeight: "800", textTransform: "uppercase" },
  reference: { marginTop: 5, color: colors.gold, fontFamily: fonts.display, fontSize: 21, fontWeight: "800" },
  successCard: { width: "100%", marginTop: 23, padding: 20, alignItems: "center", gap: 7, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  successRoom: { color: colors.white, fontFamily: fonts.display, fontSize: 23, fontWeight: "800" },
  successDetail: { color: colors.muted, fontSize: 10 },
  prototypeNote: { marginVertical: 20, color: colors.muted, fontSize: 9, lineHeight: 14, textAlign: "center" },
  doneButton: { width: "100%", height: 55, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.gold },
  doneButtonText: { color: colors.ink, fontSize: 10, fontWeight: "900", textTransform: "uppercase" }
});
