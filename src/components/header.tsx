"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Arrow } from "@/components/ui";

const nav = [
  { label: "Behandlingar", href: "/behandlingar" },
  { label: "Om kliniken", href: "/om-oss" },
  { label: "Omdömen", href: "/#omdomen" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label="Monaco Clinic – startsida"
          onClick={() => setOpen(false)}
        >
          <span>
            monaco<span className="wordmark-dot">.</span>
          </span>
          <span className="wordmark-sub">CLINIC · ESKILSTUNA</span>
        </Link>
        <nav className="desktop-nav" aria-label="Huvudmeny">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="button header-booking"
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Boka tid
            <Arrow diagonal />
          </a>
          <button
            id="menu-toggle"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            onClick={() => setOpen(!open)}
          >
            <span className={open ? "menu-lines is-open" : "menu-lines"}>
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobilmeny"
        hidden={!open}
      >
        {nav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setOpen(false)}
          >
            {item.label}
            <Arrow />
          </Link>
        ))}
        <a href={site.phoneHref}>Ring {site.phone}</a>
      </nav>
    </header>
  );
}
