import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuraOrb } from "@/components/aura/AuraOrb";
import { SearchBar } from "@/features/search/SearchBar";
import { InstallModal } from "@/features/pwa/InstallModal";

export function HomePage() {
  const navigate = useNavigate();
  const [install, setInstall] = useState(false);

  return (
    <div className="mesh relative flex min-h-[calc(100dvh-56px)] flex-col">
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center px-4 pb-16 pt-[18vh] md:pt-[22vh]">
        <AuraOrb size={120} onClick={() => setInstall(true)} />
        <p className="mt-3 max-w-[26ch] text-center text-[13px] leading-snug text-mute">
          Кликни на меня, чтобы я всегда был под рукой
        </p>

        <div className="mt-10 w-full md:mt-14">
          <SearchBar
            autoFocus
            onSubmit={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
          />
          <p className="mt-3 text-center text-[13px] font-semibold text-mute">Поиск бесплатный</p>
        </div>
      </div>
      <InstallModal open={install} onClose={() => setInstall(false)} />
    </div>
  );
}
