import clsx from "clsx";
import React from "react";
import { StyleColor, TileColor } from "../types/types";

const REVERSE_COLOR: Record<TileColor, StyleColor> = {
  B: "blue-500",
  O: "yellow-500",
  R: "red-500",
  K: "black",
};

type TileProps = {
  color: TileColor;
  number: string;
  interactive: boolean;
  onClick?: () => void;
};

export default function Tile({
  color,
  number,
  interactive,
  onClick,
}: TileProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex h-22 w-14 justify-center rounded-sm border-3 border-amber-200 bg-amber-100 text-2xl font-extrabold shadow-sm duration-200 ease-out",
        `${interactive ? "cursor-pointer hover:scale-105" : ""}`,
      )}
    >
      <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-full shadow-[inset_6px_5px_8px_2px_rgba(0,0,0,0.05)]">
        <span
          className={clsx(
            "scale-y-130 pl-0.5 text-xl select-none",
            `text-${REVERSE_COLOR[color]}`,
          )}
        >
          {number}
        </span>
      </div>
    </button>
  );
}
