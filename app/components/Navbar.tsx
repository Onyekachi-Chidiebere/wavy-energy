"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../images/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const scrollToContact = () => {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  const navLink = (href: string, label: string) => {
    const target = isHome ? href : `/${href}`;
    return (
      <li>
        <Link href={target} onClick={() => setMenuOpen(false)}>{label}</Link>
      </li>
    );
  };

  return (
    <nav id="nav" className={`${scrolled ? "s" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <div 
        className={`nav-backdrop ${menuOpen ? "active" : ""}`} 
        onClick={() => setMenuOpen(false)} 
      />
      <Link href="/" className="nl">
        <Image src={logo} alt="Wavy Energy Logo" className="nl-logo" width={92} height={74} />
      </Link>

      {/* Hamburger / Tribar */}
      <button 
        className={`nav-toggle ${menuOpen ? "active" : ""}`} 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`nm ${menuOpen ? "active" : ""}`}>
        {navLink("#about", "About")}
        {navLink("#services", "Services")}
        {navLink("#hse", "HSE")}
        {navLink("#coverage", "Coverage")}
        {navLink("#team", "Team")}
        {navLink("#contact", "Contact")}
        <li>
          <Link 
            href="/news" 
            className={pathname === "/news" ? "on" : ""}
            onClick={() => setMenuOpen(false)}
          >
            News
          </Link>
        </li>
        {/* Mobile-only contact link inside menu if needed, or just rely on the Contact link above */}
      </ul>

      <button className="nb desktop-only" onClick={scrollToContact}>
        Get In Touch
      </button>
    </nav>
  );
}
