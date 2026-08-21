import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { springSnappy } from "@/lib/motion";

type BtnVariant = "primary" | "ghost" | "soft" | "gold";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const look: Record<BtnVariant, string> = {
    primary:
      "bg-accent text-white shadow-[0_8px_24px_var(--glow)] hover:brightness-105 dark:text-[#1c1915]",
    ghost: "bg-transparent text-ink border border-line hover:bg-bg2",
    soft: "bg-bg2 text-ink hover:bg-line/60",
    gold: "bg-gold text-[#1c1915] hover:brightness-105",
  };
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[14px] font-semibold transition disabled:opacity-50 ${look[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Modal({
  open,
  onClose,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={springSnappy}
            className={`surface relative w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-3xl p-5`}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full p-2 text-mute hover:bg-bg2"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-bg2 px-2.5 py-1 text-[12px] font-semibold text-ink ${className}`}
    >
      {children}
    </span>
  );
}
