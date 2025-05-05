import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { StyleColor, TileColor } from "../types/types";

const COLORS: StyleColor[] = ["blue-500", "yellow-500", "red-500", "black"];

const REVERSE_COLOR: Record<TileColor, StyleColor> = {
  B: "blue-500",
  O: "yellow-500",
  R: "red-500",
  K: "black",
};

const COLOR_MAP: Record<StyleColor, TileColor> = {
  "blue-500": "B",
  "yellow-500": "O",
  "red-500": "R",
  black: "K",
};

const bg = (c: StyleColor) => `bg-${c}`;
const hover = (c: StyleColor) =>
  c === "black" ? "hover:bg-gray-500" : `hover:bg-${c.split("-")[0]}-400`;

type Props = {
  selected: TileColor;
  setSelected: (c: TileColor) => void;
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
          bg(REVERSE_COLOR[selected]),
          "size-13 cursor-pointer rounded-full font-bold",
        )}
        onClick={() => setOpen((o) => !o)}
      />

      {open && (
        <div className="absolute -mt-56 -ml-1 w-15 overflow-hidden rounded-lg sm:mt-0">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelected(COLOR_MAP[c]);
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
