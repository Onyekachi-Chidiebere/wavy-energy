"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import logo from "../images/logo.png";

export default function Footer() {
  const supabase = createClient();
  const [content, setContent] = useState<any>({
    footer_tagline: "Fueling Growth with Clean Energy Solutions.",
    contact_phone: "+234 916 000 8477",
    contact_email: "info@wavyenergy.com",
    contact_address: "Ikeja Lagos State, Nigeria",
  });

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data } = await supabase.from("site_content").select("*");
        if (data) {
          const contentMap: any = {};
          data.forEach((item) => {
            contentMap[item.key] = item.value;
          });
          setContent((prev: any) => ({ ...prev, ...contentMap }));
        }
      } catch (err) {
        console.error("Error fetching site content in Footer:", err);
      }
    }
    fetchContent();
  }, [supabase]);

  return (
    <footer>
      <div className="fi-inner">
        <div className="ft-top">
          <div>
            <div className="fb-logo">
              <Image src={logo} alt="Wavy Energy Logo" className="fb-logo-img" width={130} height={97} />
            </div>
            <p className="fb-tl">
              {content.footer_tagline || "Fueling Growth with Clean Energy Solutions."}
            </p>
            <div className="fb-rc">Lagos, Nigeria · 100% Nigerian-Owned</div>
          </div>
          <div>
            <div className="fc-t">Navigate</div>
            <ul className="fc-links">
              <li><a href="/#about">Company Overview</a></li>
              <li><a href="/#vision">Vision &amp; Values</a></li>
              <li><a href="/#services">Our Services</a></li>
              <li><a href="/#capabilities">Technical Capabilities</a></li>
              <li><a href="/#hse">HSE &amp; Compliance</a></li>
              <li><a href="/#coverage">Coverage &amp; Hubs</a></li>
              <li><a href="/#team">Leadership Team</a></li>
            </ul>
          </div>
          <div>
            <div className="fc-t">Services</div>
            <ul className="fc-links">
              <li><a href="/#services">Bulk Petroleum Supply</a></li>
              <li><a href="/#services">Gas Plant Engineering</a></li>
              <li><a href="/#services">Retail Distribution</a></li>
              <li><a href="/#services">Infrastructure Maintenance</a></li>
              <li><a href="/#services">Solar Power Systems</a></li>
            </ul>
          </div>
          <div>
            <div className="fc-t">Contact</div>
            <ul className="fc-links">
              <li>
                <a href={`tel:${content.contact_phone}`}>
                  {content.contact_phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${content.contact_email}`}>
                  {content.contact_email}
                </a>
              </li>
              <li><a href="#">www.wavyenergyltd.com</a></li>
              <li>
                <a href="/#contact">
                  {content.contact_address}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="ft-bot">
          <div className="ft-copy">© 2025 Wavy Energy Company Limited. All rights reserved.</div>
          <div className="ft-leg">Strictly Private &amp; Confidential</div>
        </div>
      </div>
    </footer>
  );
}
