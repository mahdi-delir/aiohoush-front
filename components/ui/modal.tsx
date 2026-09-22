"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import LiquidBg from "./liquid-bg";
import Button from "./button";
import { cn } from "@/lib/utils";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  closeOnBackdrop?: boolean;
  className?: string;
}
export function Modal({
  open,
  onClose,
  children,
  title,
  closeOnBackdrop = true,
  className,
}: ModalProps) {
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

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
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
          "w-full rounded-square p-4 max-w-xl shadow-xl",
          className,
        )}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{title}</h2>

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
          </div>
        )}

        {children}
      </LiquidBg>
    </div>,
    document.body,
  );
}
