import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowUp, Search } from "lucide-react";
import { SUGGESTIONS, TYPE_LABEL } from "@/data/queries";
import { normalizeQuery } from "@/lib/format";
import type { Suggestion } from "@/types";

export function SearchBar({
  autoFocus,
  onSubmit,
  size = "lg",
  initial = "",
  hero = false,
  onListening,
  onDraft,
}: {
  autoFocus?: boolean;
  onSubmit: (q: string) => void;
  size?: "lg" | "sm";
  initial?: string;
  hero?: boolean;
  onListening?: (v: boolean) => void;
  onDraft?: (v: string) => void;
}) {
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const items = useMemo(() => {
    const q = normalizeQuery(value);
    if (!q) return [] as Suggestion[];
    return SUGGESTIONS.filter((s) => normalizeQuery(s.text).includes(q)).slice(0, 8);
  }, [value]);

  useEffect(() => {
    setHi(0);
  }, [value]);

  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    window.addEventListener("aura-focus-search", focus);
    return () => window.removeEventListener("aura-focus-search", focus);
  }, []);

  const submit = (q: string) => {
    const t = q.trim();
    if (!t) return;
    setOpen(false);
    onSubmit(t);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!items.length) return;
      setOpen(true);
      setHi((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      setOpen(true);
      setHi((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = open && items[hi];
      submit(pick ? pick.text : value);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const lg = size === "lg";

  return (
    <div className="relative w-full">
      <div
        className={`glass flex items-center gap-3 ${
          lg ? "h-[64px] rounded-[28px] px-4 md:h-[76px] md:px-6" : "h-11 rounded-[16px] px-3"
        }`}
      >
        <Search className="shrink-0 text-mute" size={lg ? 20 : 16} />
        <input
          ref={inputRef}
          id="aura-search"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            onDraft?.(e.target.value);
          }}
          onFocus={() => {
            setOpen(true);
            onListening?.(true);
          }}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 140);
            onListening?.(false);
          }}
          onKeyDown={onKey}
          placeholder={hero ? "Что найти?" : "Что найти? Например: Honor Magic 7 Pro"}
          className={`w-full bg-transparent outline-none placeholder:text-mute ${lg ? "text-[16px] md:text-[18px]" : "text-[13px]"}`}
          role="combobox"
          aria-expanded={open && items.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
        />
        <button
          type="button"
          onClick={() => submit(value)}
          className="accent-btn grid h-9 w-9 shrink-0 place-items-center rounded-full"
          aria-label="Искать"
        >
          <ArrowUp size={16} />
        </button>
      </div>

      {open && items.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="glass absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-[20px] py-1"
        >
          {items.map((s, i) => (
            <li key={s.text} role="option" aria-selected={i === hi}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => submit(s.text)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[13px] ${
                  i === hi ? "bg-bg2" : ""
                }`}
              >
                <span className="font-medium">{s.text}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{TYPE_LABEL[s.type]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
