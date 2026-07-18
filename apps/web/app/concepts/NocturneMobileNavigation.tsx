"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./concepts.module.css";

const mobileLinks = [
  ["Rooms", "#nocturne-rooms", "01"],
  ["Services", "#nocturne-services", "02"],
  ["Werkwijze", "#nocturne-process", "03"],
  ["Visit", "#nocturne-visit", "04"]
] as const;

export function NocturneMobileNavigation() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 20);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function closeMenu(returnFocus = false) {
    setOpen(false);
    if (returnFocus) window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  return (
    <>
      <section
        className={styles.nocturneMobileMenu}
        data-open={open ? "true" : "false"}
        role="dialog"
        aria-modal="true"
        aria-label="Nocturne navigatie"
        aria-hidden={!open}
        ref={panelRef}
      >
        <header>
          <strong>Sound District</strong>
          <button type="button" onClick={() => closeMenu(true)} ref={closeRef}>
            Sluiten <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className={styles.nocturneMobileMenuBody}>
          <p>Ga direct naar</p>
          <nav>
            {mobileLinks.map(([label, href, number]) => (
              <a href={href} onClick={() => closeMenu()} key={href}>
                <span>{number}</span><strong>{label}</strong><b aria-hidden="true">↘</b>
              </a>
            ))}
          </nav>
        </div>

        <footer>
          <span>Stadswaag 20 · Antwerpen</span>
          <button
            type="button"
            data-booking="open"
            data-booking-return-focus="#nocturne-mobile-menu-trigger"
            onClick={() => closeMenu()}
          >
            Kies room &amp; moment <b aria-hidden="true">↗</b>
          </button>
        </footer>
      </section>

      <aside className={styles.nocturneMobileDock} aria-label="Mobiele snelacties">
        <button
          className={styles.nocturneMobileMenuTrigger}
          type="button"
          id="nocturne-mobile-menu-trigger"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          ref={triggerRef}
        >
          <span aria-hidden="true"><i /><i /></span>
          Menu
        </button>
        <button type="button" data-booking="open">
          Kies room &amp; moment <b aria-hidden="true">↗</b>
        </button>
      </aside>
    </>
  );
}
