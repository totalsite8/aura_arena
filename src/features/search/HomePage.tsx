import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/features/search/SearchBar";
import { InstallModal } from "@/features/pwa/InstallModal";

const AuraOrb = lazy(() => import("@/components/aura/AuraOrb").then((m) => ({ default: m.AuraOrb })));

export function HomePage() {
  const navigate = useNavigate();
  const [install, setInstall] = useState(false);

  return (
    <div className="relative flex min-h-[calc(100dvh-72px)] flex-col">
      <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col items-center px-4 pb-24 pt-[8vh] md:pt-[10vh]">
        <Suspense fallback={<div className="h-[260px] w-[260px]" />}>
          <AuraOrb size={260} onClick={() => setInstall(true)} />
        </Suspense>
        <p className="mt-2 max-w-[28ch] text-center text-[12px] leading-relaxed text-mute">
          Кликни на меня, чтобы я всегда был под рукой
        </p>

        <div className="mt-8 w-full md:mt-12">
          <SearchBar autoFocus onSubmit={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
          <div className="mt-3 flex items-center justify-center gap-3 text-[12px] text-mute">
            <span className="font-mono uppercase tracking-[0.16em]">Поиск бесплатный</span>
            <span className="hidden text-line sm:inline">/</span>
            <span className="hidden sm:inline">клавиша / — сразу в строку</span>
          </div>
        </div>
      </div>
      <InstallModal open={install} onClose={() => setInstall(false)} />
    </div>
  );
}
