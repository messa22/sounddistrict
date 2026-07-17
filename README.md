# SoundDistrict Platform

Een conversiegerichte website en cross-platform app voor SoundDistrict Antwerp. Beide producten gebruiken hetzelfde typed boekingsmodel voor rooms, extra's, prijzen en referenties.

## Structuur

- `apps/web` — Next.js marketingwebsite met vijfstappen-boeking
- `apps/mobile` — Expo Router app voor iOS en Android
- `packages/booking-core` — gedeelde rooms, prijzen, types en berekeningen

## Starten

```bash
npm install
npm run dev:web
```

De mobiele app:

```bash
npm run dev:mobile
```

Druk daarna `i` voor iOS Simulator of scan de QR-code met een compatibele Expo Go-build.

## Wat werkt in het prototype

- website met duidelijke room-CTA's en responsive ontwerp;
- room-, datum-, tijd-, duur-, extra- en contactselectie;
- transparante prijsberekening;
- lokaal opgeslagen boekingsreferentie;
- native home, rooms, boekingswizard, sessie-overzicht en profiel;
- herboeken vanuit een bestaande sessie.

## Productiekoppelingen

Vervang lokale opslag door één booking API met realtime beschikbaarheid en server-side prijsvalidatie. Voeg daarna betaling, teambevestiging, e-mail/pushnotificaties, login en privacy/voorwaarden toe. De UI noemt een boeking bewust een aanvraag totdat deze backend bestaat.
