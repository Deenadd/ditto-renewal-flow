"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckMarkIcon, ChevronDownIcon } from "@/components/icons";

export type MenuOption = {
  value: string;
  label: string;
  /** Second line, for saying what the option actually is. */
  hint?: string;
};

/**
 * Menu button for switching between versions of a screen.
 *
 * A native <select> would be less code, but picking an option here can change
 * the page, and a select fires its change on every arrow key — so a keyboard
 * user would be moved before they had chosen. This commits on click or Enter
 * instead, and returns focus to the trigger the way the ARIA menu pattern asks.
 */
export function VersionMenu({
  label,
  value,
  options,
  onChange,
  align = "start",
  className = "",
}: {
  /** Accessible name; never shown, the chosen option is the visible text. */
  label: string;
  value: string;
  options: MenuOption[];
  onChange: (value: string) => void;
  align?: "start" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [active, setActive] = useState(selected);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  /* Focus follows the active option while the menu is open. */
  useEffect(() => {
    if (open) itemRefs.current[active]?.focus();
  }, [open, active]);

  /* Close on a click outside or on any scroll that moves the trigger away. */
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function openAt(index: number) {
    setActive(index);
    setOpen(true);
  }

  function close({ refocus }: { refocus: boolean }) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function choose(index: number) {
    onChange(options[index].value);
    close({ refocus: true });
  }

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAt(selected);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAt(options.length - 1);
    }
  }

  function onMenuKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => (index + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => (index - 1 + options.length) % options.length);
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        close({ refocus: true });
        break;
      case "Tab":
        close({ refocus: false });
        break;
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close({ refocus: false }) : openAt(selected))}
        onKeyDown={onTriggerKeyDown}
        className="flex h-8 max-w-full items-center gap-1.5 rounded-lg border border-grey-200 bg-white pr-2 pl-2.5 text-[13px] leading-none font-medium whitespace-nowrap text-ink shadow-card transition-[background-color,border-color,transform] duration-150 hover:bg-grey-50 active:scale-[0.96]"
      >
        <span className="truncate">{options[selected]?.label}</span>
        <ChevronDownIcon
          className={`shrink-0 text-ink-secondary transition-transform duration-200 ease-strong ${
            open ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>

      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className={`absolute top-[calc(100%+6px)] z-40 w-[248px] max-w-[calc(100vw-32px)] min-w-full origin-top rounded-xl border border-grey-150 bg-white p-1 shadow-[0_8px_28px_-6px_rgb(30_37_75_/_0.14),0_2px_6px_-2px_rgb(30_37_75_/_0.08)] motion-safe:animate-menu ${
            align === "end" ? "left-0 lg:right-0 lg:left-auto" : "left-0"
          }`}
        >
          {options.map((option, index) => {
            const isSelected = index === selected;
            return (
              <button
                key={option.value}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                tabIndex={index === active ? 0 : -1}
                onClick={() => choose(index)}
                onPointerEnter={() => setActive(index)}
                className="flex w-full items-start gap-2 rounded-lg py-2 pr-3 pl-2 text-left transition-colors duration-150 hover:bg-grey-100 focus-visible:bg-grey-100"
              >
                <span className="mt-[3px] grid size-3.5 shrink-0 place-items-center text-primary">
                  {isSelected ? <CheckMarkIcon size={12} /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] leading-none font-medium whitespace-nowrap text-ink">
                    {option.label}
                  </span>
                  {option.hint ? (
                    <span className="mt-1 block text-[12px] leading-[1.35] text-ink-secondary">
                      {option.hint}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
