import clsx from "clsx";
import React from "react";

type Color = "blue-500" | "yellow-500" | "red-500" | "black";

type TileProps = {
  color: Color;
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
        "m-0.75 flex h-28 w-17 justify-center rounded-sm border-3 border-amber-200 bg-amber-100 text-3xl font-extrabold shadow-sm duration-200 ease-out",
        `${interactive ? "cursor-pointer hover:scale-105" : ""}`,
      )}
    >
      <div className="mt-1 flex h-16 w-16 items-center justify-center rounded-full shadow-[inset_5px_5px_4px_4px_rgba(0,0,0,0.05)]">
        <span className={clsx("scale-y-130 pt-1", `text-${color}`)}>
          {number}
        </span>
      </div>
    </button>
  );
}
