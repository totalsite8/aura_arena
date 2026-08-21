import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Coins } from "lucide-react";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { useAuraStore } from "@/store/useAuraStore";
import { formatPoints } from "@/lib/format";
import { useTheme } from "@/hooks/useTheme";

export function Shell() {
  useTheme();
  const points = useAuraStore((s) => s.points);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const home = pathname === "/";

  return (
    <div className="min-h-dvh text-ink">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
            aria-label="Aura — на главную"
          >
            <span
              className="block h-7 w-7 rounded-full"
              style={{
                background: "radial-gradient(circle at 32% 28%, #FDE68A, #F59E0B 55%, #F97316)",
                boxShadow: "0 2px 12px rgba(249,115,22,.45)",
              }}
            />
            <span className="font-display text-[20px] leading-none">Aura</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="/wallet"
              className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold"
            >
              <Coins size={15} />
              {formatPoints(points)}
            </Link>
            <ThemeToggle compact={home} />
          </div>
        </div>
      </header>
      <Outlet />
      {!home && (
        <footer className="mx-auto flex max-w-[1100px] flex-wrap gap-3 px-4 py-8 text-[12px] text-mute">
          <Link to="/terms">Оферта</Link>
          <Link to="/privacy">Конфиденциальность</Link>
          <Link to="/wallet">Баллы Aura</Link>
        </footer>
      )}
    </div>
  );
}
