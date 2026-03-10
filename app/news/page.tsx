"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

type NewsArticle = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string;
  source: string | null;
  source_url: string | null;
  image: string | null;
  img_credit: string | null;
  date: string | null;
  tags: string[] | null;
  display_order: number | null;
};

const CATEGORIES = ["petroleum", "gas", "solar", "regulatory", "market"] as const;
const CAT_LABELS: Record<string, string> = {
  petroleum: "Petroleum",
  gas: "Gas",
  solar: "Solar",
  regulatory: "Regulatory",
  market: "Market",
};
const COLORS: Record<string, string> = {
  petroleum: "#1e6b3a",
  solar: "#c8900a",
  gas: "#1a5c7a",
  regulatory: "#7a3a1a",
  market: "#2a3a7a",
  general: "#555",
};
const GRADS: Record<string, string> = {
  petroleum: "linear-gradient(145deg,#0e1f12,#1e4028)",
  solar: "linear-gradient(145deg,#1e1404,#3a2a08)",
  gas: "linear-gradient(145deg,#04121c,#0a2030)",
  regulatory: "linear-gradient(145deg,#1c0c04,#341808)",
  market: "linear-gradient(145deg,#04081c,#0a1238)",
  general: "linear-gradient(145deg,#141414,#2a2a2a)",
};
const ICONS: Record<string, string> = {
  petroleum: "⛽",
  solar: "🔆",
  gas: "🏭",
  regulatory: "🏛️",
  market: "📊",
  general: "📰",
};

function fmtDate(d: string | null): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [overlayArticle, setOverlayArticle] = useState<NewsArticle | null>(null);
  const [toast, setToast] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const aoRef = useRef<HTMLDivElement>(null);
  const aoProgRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("date", { ascending: false })
        .order("display_order", { ascending: true });
      if (!error && data) setArticles((data as NewsArticle[]) || []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const filtered = useMemo(() => {
    let list = categoryFilter === "all" ? articles : articles.filter((a) => a.category === categoryFilter);
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.excerpt || "").toLowerCase().includes(q) ||
          (a.source || "").toLowerCase().includes(q) ||
          (a.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [articles, categoryFilter, searchQuery]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => (a.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 12);
  }, [articles]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openArticle = (a: NewsArticle) => {
    setOverlayArticle(a);
    if (typeof document !== "undefined") document.body.style.overflow = "hidden";
  };

  const closeOverlay = () => {
    setOverlayArticle(null);
    if (typeof document !== "undefined") document.body.style.overflow = "";
  };

  useEffect(() => {
    if (!overlayArticle || !aoRef.current || !aoProgRef.current) return;
    const el = aoRef.current;
    const prog = aoProgRef.current;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = clientHeight >= scrollHeight ? 100 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      prog.style.width = `${pct}%`;
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [overlayArticle]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail || !nlEmail.includes("@")) {
      showToast("Please enter a valid email.");
      return;
    }
    showToast("Subscribed to Wavy Energy Insights.");
    setNlEmail("");
  };

  const copyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard)
      navigator.clipboard.writeText(window.location.href);
    showToast("Link copied.");
  };

  const filterByTag = (tag: string) => {
    setCategoryFilter("all");
    setSearchQuery(tag);
  };

  const col = (cat: string) => COLORS[cat] || COLORS.general;
  const grad = (cat: string) => GRADS[cat] || GRADS.general;
  const icon = (cat: string) => ICONS[cat] || ICONS.general;

  if (loading) {
    return (
      <div className="news-page flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--sub)]">
          <span className="h-2 w-2 animate-ping rounded-full bg-[var(--gold)]" />
          <span className="text-sm">Loading insights…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <nav>
        <Link href="/" className="n-logo">
          <div className="n-diamond" />
          <span className="n-name">Wavy Energy</span>
        </Link>
        <ul className="n-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/#services">Services</Link></li>
          <li><Link href="/#coverage">Coverage</Link></li>
          <li><Link href="/news" className="on">Insights</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
        <div className="n-badge"><span className="n-dot" /> Sector Intelligence</div>
      </nav>

      <header className="ph">
        <div>
          <div className="ph-eyebrow">Nigeria Energy Desk</div>
          <h1 className="ph-h1">Nigeria&apos;s Energy<br /><em>Insights.</em></h1>
        </div>
        <div className="ph-right">
          <div className="ph-date-badge">{fmtDate(new Date().toISOString().slice(0, 10))}</div>
          <p className="ph-desc">Curated intelligence across Nigeria&apos;s petroleum, gas, and renewable energy sectors — updated by the Wavy Energy team.</p>
        </div>
      </header>

      <div className="filter-row">
        <div className="filters">
          <button
            type="button"
            className={`f-btn ${categoryFilter === "all" ? "on" : ""}`}
            onClick={() => { setCategoryFilter("all"); setSearchQuery(""); }}
          >
            All Sectors
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`f-btn ${categoryFilter === c ? "on" : ""}`}
              onClick={() => { setCategoryFilter(c); setSearchQuery(""); }}
            >
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search articles…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="layout">
        <div className="posts-list">
          <div className="section-label">
            <span className="sl-text">Latest Articles</span>
            <span className="sl-count">
              {filtered.length} stor{filtered.length === 1 ? "y" : "ies"}
            </span>
            <div className="sl-line" />
          </div>

          {filtered.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">📭</div>
              <div className="no-results-title">No articles found</div>
              <div className="no-results-sub">Try a different category or search term.</div>
            </div>
          ) : (
            <div className="posts-container">
              {filtered.map((a, i) => {
                const isFeatured = i === 0;
                const isMagDuo = i === 1 && filtered.length > 2;
                if (isMagDuo) {
                  return (
                    <div key={`mag-${filtered[1].id}-${filtered[2].id}`} className="mag-duo">
                      <PostCard article={filtered[1]} index={1} isMag onOpen={() => openArticle(filtered[1])} col={col} grad={grad} icon={icon} />
                      <PostCard article={filtered[2]} index={2} isMag onOpen={() => openArticle(filtered[2])} col={col} grad={grad} icon={icon} />
                    </div>
                  );
                }
                if (i === 2 && filtered.length > 2) return null;
                return (
                  <PostCard
                    key={a.id}
                    article={a}
                    index={i}
                    featured={isFeatured}
                    onOpen={() => openArticle(a)}
                    col={col}
                    grad={grad}
                    icon={icon}
                  />
                );
              })}
            </div>
          )}
        </div>

        <aside className="sidebar">
          <div className="sb-block">
            <div className="sb-h">About this Feed</div>
            <p className="sb-about-text">Curated by the Wavy Energy intelligence team, this feed covers Nigeria&apos;s downstream petroleum markets, gas infrastructure, solar adoption, and regulatory landscape.</p>
            <Link href="/#about" className="sb-about-link">About Wavy Energy →</Link>
          </div>
          <div className="sb-block">
            <div className="sb-h">Topics</div>
            <div className="sb-topics">
              <button type="button" className="sb-topic" onClick={() => { setCategoryFilter("all"); setSearchQuery(""); }}>
                <span className="sb-topic-name"><span className="sb-topic-bar" style={{ background: "var(--gold)" }} /> All</span>
              </button>
              {CATEGORIES.map((c) => (
                <button key={c} type="button" className="sb-topic" onClick={() => { setCategoryFilter(c); setSearchQuery(""); }}>
                  <span className="sb-topic-name"><span className="sb-topic-bar" style={{ background: col(c) }} /> {CAT_LABELS[c]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="sb-block">
            <div className="sb-h">Trending Now</div>
            <div className="sb-trending">
              {articles.slice(0, 4).map((a) => (
                <button key={a.id} type="button" className="sb-trend" onClick={() => openArticle(a)}>
                  <div className="sb-trend-thumb">
                    {a.image ? (
                      <img src={a.image} alt="" />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, background: grad(a.category), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", opacity: 0.55 }}>
                        {icon(a.category)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="sb-trend-cat" style={{ color: col(a.category) }}>{CAT_LABELS[a.category] || a.category}</div>
                    <div className="sb-trend-title">{a.title.length > 60 ? a.title.slice(0, 60) + "…" : a.title}</div>
                    <div className="sb-trend-source">{a.source || ""}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="sb-block">
            <div className="sb-nl-card">
              <div className="sb-h">Newsletter</div>
              <h3 className="sb-nl-head">Weekly market<br /><em>intelligence.</em></h3>
              <p className="sb-nl-sub">Pricing reports, regulatory updates, sector analysis. Free, always.</p>
              <form onSubmit={handleNlSubmit}>
                <input
                  className="sb-nl-email"
                  type="email"
                  placeholder="your@email.com"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                />
                <button type="submit" className="sb-nl-btn">Subscribe →</button>
              </form>
            </div>
          </div>
          <div className="sb-block">
            <div className="sb-h">Trending Tags</div>
            <div className="sb-tags">
              {allTags.map((t) => (
                <button key={t} type="button" className="sb-tag" onClick={() => filterByTag(t)}>{t}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <footer className="news-footer">
        <span className="ft-l">© 2026 Wavy Energy Company Limited · RC 8354129</span>
        <div className="ft-links">
          <Link href="/">Home</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#contact">Contact</Link>
        </div>
      </footer>

      <div
        ref={aoRef}
        className={`ao ${overlayArticle ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Article"
      >
        <div className="ao-top">
          <button type="button" className="ao-back" onClick={closeOverlay}>← Back to Feed</button>
          <div className="ao-prog-wrap"><div ref={aoProgRef} className="ao-prog" /></div>
          <div className="ao-share">
            <button type="button" className="ao-sb" onClick={copyLink}>Copy Link</button>
            <a
              href={overlayArticle ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="ao-sb"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="ao-inner">
          {overlayArticle && (
            <ArticleOverlayContent article={overlayArticle} col={col} grad={grad} icon={icon} fmtDate={fmtDate} />
          )}
        </div>
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}

function PostCard({
  article: a,
  index,
  featured,
  isMag,
  onOpen,
  col,
  grad,
  icon,
}: {
  article: NewsArticle;
  index: number;
  featured?: boolean;
  isMag?: boolean;
  onOpen: () => void;
  col: (c: string) => string;
  grad: (c: string) => string;
  icon: (c: string) => string;
}) {
  const color = col(a.category);
  const gradient = grad(a.category);
  const emoji = icon(a.category);
  return (
    <div
      role="button"
      tabIndex={0}
      className={`post-card ${featured ? "featured" : ""}`}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
    >
      {!featured && !isMag && <div className="pc-num">0{index + 1}</div>}
      <div className="pc-main">
        <div className="pc-img-wrap">
          {a.image ? (
            <img className="pc-img" src={a.image} alt="" loading="lazy" />
          ) : (
            <div className="pc-fallback">
              <div className="pc-fallback-bg" style={{ background: gradient }} />
              <span>{emoji}</span>
            </div>
          )}
          <div className="pc-cat-strip" style={{ background: color }} />
          {featured && <div className="pc-featured-label">Top Story</div>}
          <div className="pc-source-badge">{a.source || "Source"}</div>
          {a.img_credit && <div className="pc-img-credit">Photo: {a.img_credit}</div>}
        </div>
        <div className="pc-body">
          <div>
            <div className="pc-meta">
              <span className="pc-cat" style={{ color }}>{CAT_LABELS[a.category] || a.category}</span>
              <div className="pc-dot" />
              <span className="pc-date">{fmtDate(a.date)}</span>
            </div>
            <h3 className="pc-title">{a.title}</h3>
            <p className="pc-excerpt">{a.excerpt || ""}</p>
          </div>
          <div className="pc-foot">
            <span className="pc-source">{a.source || ""}</span>
            <span className="pc-readlink">Read Story →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleOverlayContent({
  article: a,
  col,
  grad,
  icon,
  fmtDate: fd,
}: {
  article: NewsArticle;
  col: (c: string) => string;
  grad: (c: string) => string;
  icon: (c: string) => string;
  fmtDate: (d: string | null) => string;
}) {
  const color = col(a.category);
  const gradient = grad(a.category);
  const emoji = icon(a.category);
  const body = (a.body || "").split("\n").filter(Boolean);
  return (
    <>
      {a.image ? (
        <img className="ao-hero" src={a.image} alt="" />
      ) : (
        <div className="ao-hero-fallback" style={{ background: gradient }}>{emoji}</div>
      )}
      <div className="ao-cat-row">
        <span className="ao-cat" style={{ color }}>{CAT_LABELS[a.category] || a.category}</span>
        <div className="ao-sep" />
        <span className="ao-date">{fd(a.date)}</span>
        <div className="ao-sep" />
        <span className="ao-date">{a.source || ""}</span>
      </div>
      <h1 className="ao-h1">{a.title}</h1>
      <p className="ao-subtitle">{a.excerpt || ""}</p>
      <div className="ao-author-row">
        <div className="ao-logo">{(a.source || "WE").substring(0, 2).toUpperCase()}</div>
        <div>
          <div className="ao-aname">{a.source || "Wavy Energy"}</div>
          <div className="ao-arole">Published {fd(a.date)}</div>
        </div>
      </div>
      {a.img_credit && (
        <span className="ao-img-credit">
          Photo:{" "}
          {a.source_url ? (
            <a href={a.source_url} target="_blank" rel="noopener noreferrer">{a.img_credit}</a>
          ) : (
            a.img_credit
          )}
        </span>
      )}
      <div className="ao-body">
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--line)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {(a.tags || []).map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--bc)",
              fontSize: ".54rem",
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              padding: "5px 12px",
              border: "1px solid var(--line)",
              color: "var(--dim)",
            }}
          >
            {t}
          </span>
        ))}
        {a.source_url && (
          <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="ao-source-link">
            Read original on {a.source || "source"} →
          </a>
        )}
      </div>
    </>
  );
}
