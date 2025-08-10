import { useEffect, useMemo, useRef, useState } from "react";
import s from "./Select.module.css";

/**
 * Accessible custom select for consistent styling across browsers
 */
const Select = ({
  label,
  name,
  value = "",
  onChange,
  options = [],
  placeholder = "Select",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const selected = useMemo(
    () => options.find((opt) => opt.value === value) ?? null,
    [options, value]
  );

  useEffect(() => {
    const handleClickOutside = (evt) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(evt.target)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (evt) => {
      if (evt.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleToggle = () => setIsOpen((v) => !v);

  const handleSelect = (opt) => {
    onChange?.({ target: { name, value: opt.value } });
    setIsOpen(false);
    // move focus back to button for a11y
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  const onKeyDown = (evt) => {
    if (
      !isOpen &&
      (evt.key === "ArrowDown" || evt.key === "Enter" || evt.key === " ")
    ) {
      evt.preventDefault();
      setIsOpen(true);
      requestAnimationFrame(() =>
        listRef.current?.querySelector("[data-active]")?.focus()
      );
      return;
    }
    if (isOpen) {
      const focusable = Array.from(
        listRef.current?.querySelectorAll("button[role='option']") ?? []
      );
      const currentIndex = focusable.findIndex(
        (el) => el === document.activeElement
      );
      if (evt.key === "ArrowDown") {
        evt.preventDefault();
        const next =
          focusable[Math.min(currentIndex + 1, focusable.length - 1)];
        next?.focus();
      } else if (evt.key === "ArrowUp") {
        evt.preventDefault();
        const prev = focusable[Math.max(currentIndex - 1, 0)];
        prev?.focus();
      } else if (evt.key === "Home") {
        focusable[0]?.focus();
      } else if (evt.key === "End") {
        focusable[focusable.length - 1]?.focus();
      }
    }
  };

  return (
    <div className={`${s.container} ${className}`} ref={containerRef}>
      {label ? <p className={s.label}>{label}</p> : null}
      <button
        ref={buttonRef}
        type="button"
        className={s.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleToggle}
        onKeyDown={onKeyDown}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className={s.chevron} aria-hidden>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className={s.popover} role="listbox" ref={listRef} tabIndex={-1}>
          {options.map((opt) => (
            <button
              key={opt.value}
              role="option"
              type="button"
              className={
                value === opt.value ? `${s.option} ${s.active}` : s.option
              }
              aria-selected={value === opt.value}
              data-active={value === opt.value || undefined}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {/* hidden input to integrate with simple form libs if needed */}
      <input type="hidden" name={name} value={value} readOnly />
    </div>
  );
};

export default Select;
