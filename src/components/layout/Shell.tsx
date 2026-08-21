import { useEffect, type ReactNode } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Coins, Home, Search } from "lucide-react";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { SearchBar } from "@/features/search/SearchBar";
import { useAuraStore } from "@/store/useAuraStore";
import { formatPoints } from "@/lib/format";
import { useTheme } from "@/hooks/useTheme";

export function Shell() {
  useTheme();
  const points = useAuraStore((s) => s.points);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const home = pathname === "/";
  const onSearch = pathname.startsWith("/search");
  const onWallet = pathname.startsWith("/wallet");
  const q = new URLSearchParams(search).get("q") ?? "";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && !typing) {
        e.preventDefault();
        if (home) {
          window.dispatchEvent(new Event("aura-focus-search"));
        } else {
          navigate("/search");
          window.setTimeout(() => window.dispatchEvent(new Event("aura-focus-search")), 40);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [home, navigate]);

  const submit = (q: string) => {
    const params = new URLSearchParams(search);
    const fast = params.get("fast") === "1";
    navigate(`/search?q=${encodeURIComponent(q)}${fast ? "&fast=1" : ""}`);
  };

  return (
    <div className="mesh min-h-dvh text-ink">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <div className="mx-auto max-w-[1480px] px-3 pt-3">
          <div className="glass-nav pointer-events-auto flex items-center gap-2 rounded-[22px] p-1.5 pl-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 pr-2"
              aria-label="Aura — на главную"
            >
              <span className="relative grid h-7 w-7 place-items-center">
                <span className="absolute inset-0 rounded-[10px] bg-[radial-gradient(circle_at_30%_25%,#fde68a,#f59e0b_55%,#7c2d12)]" />
              </span>
              <span className="font-display text-[18px] leading-none">Aura</span>
            </button>

            <div className="hidden min-w-0 flex-1 md:block">
              {!home && <SearchBar key={q} size="sm" initial={q} onSubmit={submit} />}
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <Link
                to="/wallet"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold hover:bg-bg2"
              >
                <Coins size={14} />
                {formatPoints(points)}
              </Link>
              <ThemeToggle compact />
            </div>
          </div>

          {!home && (
            <div className="pointer-events-auto mt-2 md:hidden">
              <SearchBar key={`m-${q}`} size="sm" initial={q} onSubmit={submit} />
            </div>
          )}
        </div>
      </header>

      <div className={home ? "pt-[72px]" : "pt-[84px] pb-24 md:pt-[88px] md:pb-8"}>
        <Outlet />
      </div>

      <nav className="glass-nav pointer-events-auto fixed inset-x-3 bottom-3 z-40 flex h-14 items-center justify-around rounded-full px-2 md:hidden">
        <NavBtn active={home} onClick={() => navigate("/")} icon={<Home size={18} />} label="Главная" />
        <NavBtn
          active={onSearch}
          onClick={() => {
            navigate(onSearch ? "/search" : "/search");
            window.setTimeout(() => window.dispatchEvent(new Event("aura-focus-search")), 40);
          }}
          icon={<Search size={18} />}
          label="Поиск"
        />
        <NavBtn active={onWallet} onClick={() => navigate("/wallet")} icon={<Coins size={18} />} label="Баллы" />
      </nav>
    </div>
  );
}

function NavBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-[72px] flex-col items-center gap-0.5 rounded-full px-3 py-1 text-[10px] font-semibold ${
        active ? "text-ink" : "text-mute"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
