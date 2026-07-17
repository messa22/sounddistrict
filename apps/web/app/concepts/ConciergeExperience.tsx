"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./concepts.module.css";

const conciergeRooms = [
  { id: "blue", name: "Blue", fullName: "Blue Room", image: "room-blue-editorial.webp" },
  { id: "red", name: "Red", fullName: "Red Room", image: "room-red-editorial.webp" },
  { id: "infinity", name: "Infinity", fullName: "Infinity", image: "room-infinity-editorial.webp" }
] as const;

type ConciergeRoomId = (typeof conciergeRooms)[number]["id"];

export function ConciergeExperience({ basePath }: { basePath: string }) {
  const [selectedId, setSelectedId] = useState<ConciergeRoomId>("blue");
  const selected = conciergeRooms.find((room) => room.id === selectedId) ?? conciergeRooms[0];
  const selectedIndex = conciergeRooms.findIndex((room) => room.id === selectedId);

  return (
    <>
      <div className={styles.conciergeVisual}>
        {conciergeRooms.map((room) => (
          <Image
            className={`${styles.conciergeVisualFrame} ${room.id === selectedId ? styles.conciergeVisualFrameActive : ""}`}
            src={`${basePath}/${room.image}`}
            alt={room.id === selectedId ? `${room.fullName} bij SoundDistrict` : ""}
            fill
            priority={room.id === "blue"}
            sizes="100vw"
            key={room.id}
          />
        ))}
        <div className={styles.conciergeVisualMeta}>
          <span>0{selectedIndex + 1} / 03</span>
          <span>{selected.fullName} · Antwerp</span>
        </div>
        <div className={styles.conciergeTabs} aria-label="Kies een room">
          {conciergeRooms.map((room) => (
            <button
              className={room.id === selectedId ? styles.conciergeTabActive : ""}
              type="button"
              aria-pressed={room.id === selectedId}
              onClick={() => setSelectedId(room.id)}
              key={room.id}
            >
              {room.name}
            </button>
          ))}
        </div>
        <button className={styles.conciergeQuick} type="button" data-booking={selectedId}>
          Bekijk beschikbaarheid <span>→</span>
        </button>
      </div>

      <div className={styles.conciergePanel}>
        <div className={styles.conciergeTitle}>
          <p>Private session</p>
          <h1>Kies je room.<br /><em>Plan je moment.</em></h1>
        </div>
        <div className={styles.conciergeForm}>
          <button type="button" data-booking={selectedId}>
            <span>Room</span><strong>{selected.fullName}</strong><b>›</b>
          </button>
          <button type="button" data-booking={selectedId}>
            <span>Moment</span><strong>Kies datum</strong><b>›</b>
          </button>
          <button className={styles.conciergePrimary} type="button" data-booking={selectedId}>
            Plan je sessie <span>→</span>
          </button>
          <small>Geen betaling · prijs en beschikbaarheid worden persoonlijk bevestigd.</small>
        </div>
      </div>
    </>
  );
}
