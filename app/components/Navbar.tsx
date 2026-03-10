"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../images/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () => {
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
        <Link href={target}>{label}</Link>
      </li>
    );
  };

  return (
    <nav id="nav" className={scrolled ? "s" : ""}>
      <Link href="/" className="nl">
        <Image src={logo} alt="Wavy Energy Logo" className="nl-logo" width={92} height={74} />
      </Link>
      <ul className="nm">
        {navLink("#about", "About")}
        {navLink("#services", "Services")}
        {navLink("#hse", "HSE")}
        {navLink("#coverage", "Coverage")}
        {navLink("#team", "Team")}
        {navLink("#contact", "Contact")}
        <li>
          <Link href="/news" className={pathname === "/news" ? "on" : ""}>News</Link>
        </li>
      </ul>
      <button className="nb" onClick={scrollToContact}>
        Get In Touch
      </button>
    </nav>
  );
}
