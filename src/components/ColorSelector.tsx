import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const COLORS = ["blue-500", "yellow-500", "red-500", "black"] as const;
type Color = (typeof COLORS)[number];

const bg = (c: Color) => `bg-${c}`;
const hover = (c: Color) =>
  c === "black" ? "hover:bg-gray-500" : `hover:bg-${c.split("-")[0]}-400`;

type Props = {
  selected: Color;
  setSelected: (c: Color) => void;
};

export default function ColorSelector({
  selected,
  setSelected,
}: Props): React.ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        className={clsx(
          bg(selected),
          "h-15 w-15 cursor-pointer rounded-full font-bold",
        )}
        onClick={() => setOpen((o) => !o)}
      />

      {open && (
        <div className="absolute mt-3 w-15 overflow-hidden rounded-lg shadow-lg">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelected(c);
                setOpen(false);
              }}
              className={clsx(
                bg(c),
                hover(c),
                "block h-10 w-full cursor-pointer",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
