"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import LiquidBg from "./liquid-bg";
import Button from "./button";
import { cn } from "@/lib/utils";
// باید با duration کلاس‌های پایین یکی باشد.
const ANIMATION_MS = 320;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  closeOnBackdrop?: boolean;
  className?: string;
  closeButton?: boolean;
}
export function Modal({
  open,
  onClose,
  children,
  title,
  closeOnBackdrop = true,
  closeButton = true,
  className,
}: ModalProps) {
  // rendered: در DOM هست؛ shown: در حالت باز (برای انیمیشن ورود/خروج)
  const [rendered, setRendered] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      // یک فریم صبر تا حالت بسته رندر شود و transition اجرا شود.
      const frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShown(true)),
      );
      return () => cancelAnimationFrame(frame);
    }

    setShown(false);
    const timer = window.setTimeout(() => setRendered(false), ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!rendered) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-end bg-black/50 transition-opacity duration-300 ease-out motion-reduce:transition-none",
        shown ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onMouseDown={() => {
        if (closeOnBackdrop) {
          onClose();
        }
      }}
    >
      <LiquidBg
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "w-full rounded-square p-4 max-w-xl shadow-2xl",
          // کشو از سمت راست؛ منحنی شبیه sheet های iOS
          "transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          shown ? "translate-x-0" : "translate-x-full",
          className,
        )}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{title}</h2>

            {closeButton && (
              <Button
                variant="danger"
                size="sm"
                type="button"
                onClick={onClose}
                aria-label="بستن"
                className="w-fit"
              >
                ✕
              </Button>
            )}
          </div>
        )}

        {children}
      </LiquidBg>
    </div>,
    document.body,
  );
}
