import clsx from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { StyleColor, TileColor, TileDataList } from "../types/types";
import ColorSelector from "./ColorSelector";
import Tile from "./Tile";

const pointInRect = (r: DOMRect, x: number, y: number) =>
  x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;

const REVERSE_COLOR: Record<TileColor, StyleColor> = {
  B: "blue-500",
  O: "yellow-500",
  R: "red-500",
  K: "black",
};

const borderText = (c: StyleColor) =>
  clsx(
    c === "black" ? "border-black" : `border-${c}`,
    c === "black" ? "text-black" : `text-${c}`,
  );

const numberOptions = [...Array(13).keys()].map((i) => `${i + 1}`).concat("J");

type RackTileProps = {
  rackTiles: TileDataList;
  setRackTiles: (newTiles: TileDataList) => void;
};

export default function RackTiles({ rackTiles, setRackTiles }: RackTileProps) {
  const dropRef = useRef<HTMLDivElement>(null!);
  const dragRef = useRef<HTMLDivElement>(null!);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [editColor, setEditColor] = useState<TileColor>("B");
  const [editNumber, setEditNumber] = useState("1");

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStop = (_e: DraggableEvent, _data: DraggableData) => {
    if (!dragRef.current) return;

    const r = dragRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    if (pointInRect(dropRef.current.getBoundingClientRect(), cx, cy)) {
      setRackTiles(rackTiles.concat([[editColor, editNumber]]));
    }

    resetPosition();
  };

  useLayoutEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [rackTiles.length]);

  const handleRemoveTile = (tileIdx: number) => {
    setRackTiles(rackTiles.filter((_, i) => i !== tileIdx));
  };

  const handleClearCurrent = () => {
    if (
      window.confirm("This will clear all tiles in the rack. Are you sure?")
    ) {
      setRackTiles([]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <div
          ref={dropRef}
          className="grid max-h-[50vh] min-h-30 w-full max-w-[80vw] min-w-85 grid-cols-5 place-items-center gap-2 overflow-y-auto scroll-smooth rounded border-2 border-gray-300 px-2 py-2 sm:min-w-150 sm:grid-cols-9 lg:min-w-200 lg:grid-cols-12"
        >
          {rackTiles.map((tile, idx) => (
            <Tile
              key={idx}
              color={tile[0]}
              number={tile[1]}
              interactive
              onClick={() => handleRemoveTile(idx)}
            />
          ))}
        </div>

        {rackTiles.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-gray-600 select-none">
            drag & drop a tile here
          </p>
        )}
      </div>

      <div className="my-2 flex items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-3">
          <ColorSelector selected={editColor} setSelected={setEditColor} />
        </div>

        <Draggable
          nodeRef={dragRef}
          position={position}
          onStop={handleStop}
          onDrag={(_, data) => setPosition({ x: data.x, y: data.y })}
        >
          <div ref={dragRef} className="cursor-move select-none">
            <Tile color={editColor} number={editNumber} interactive />
          </div>
        </Draggable>

        <div className="flex flex-col items-center gap-3">
          <select
            value={editNumber}
            onChange={(e) => setEditNumber(e.target.value)}
            className={clsx(
              "w-13 cursor-pointer rounded border-3 py-1 pl-2 text-center text-xl sm:pl-0",
              borderText(REVERSE_COLOR[editColor]),
            )}
          >
            {numberOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        className="text-md flex w-52 cursor-pointer items-center justify-center rounded bg-red-300 py-2 shadow-sm duration-200 ease-out hover:bg-red-400"
        onClick={handleClearCurrent}
      >
        Clear Tiles
      </button>
    </div>
  );
}
