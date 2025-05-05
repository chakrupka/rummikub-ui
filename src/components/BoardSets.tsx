import clsx from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { StyleColor, TileColor, TileData, TileDataSets } from "../types/types";
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

type BoardSetsProps = {
  boardSets: TileDataSets;
  setBoardSets: (newSets: TileDataSets) => void;
};

export default function BoardSets({ boardSets, setBoardSets }: BoardSetsProps) {
  const dropRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragRef = useRef<HTMLDivElement>(null!);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [editColor, setEditColor] = useState<TileColor>("B");
  const [editNumber, setEditNumber] = useState("1");

  const addToSet = (idx: number, tile: TileData) => {
    if (boardSets[idx].length < 5) {
      setBoardSets(
        boardSets.map((tiles, i) => (i === idx ? [...tiles, tile] : tiles)),
      );
    }
  };

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStop = (_e: DraggableEvent, _data: DraggableData) => {
    if (!dragRef.current) return;

    const r = dragRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const found = dropRefs.current.findIndex(
      (el) => el && pointInRect(el.getBoundingClientRect(), cx, cy),
    );

    if (found >= 0) {
      addToSet(found, [editColor, editNumber]);
    }

    resetPosition();
  };

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [boardSets.length]);

  const handleRemoveTile = (tilesIdx: number, tileIdx: number) => {
    setBoardSets(
      boardSets.filter((tiles, i) =>
        i === tilesIdx ? tiles.filter((_, j) => j !== tileIdx) : tiles,
      ),
    );
  };

  const handleRemoveSet = (tilesIdx: number) => {
    if (boardSets.length === 1) {
      setBoardSets([[]]);
    } else {
      setBoardSets(boardSets.filter((_, i) => i !== tilesIdx));
    }
  };

  const handleClearCurrent = () => {
    if (
      window.confirm("This will clear all sets on the board. Are you sure?")
    ) {
      setBoardSets([[]]);
    }
  };

  const renderAsGrid = () => {
    if (boardSets.length <= 1) {
      return "";
    } else if (boardSets.length === 2) {
      return "lg:grid lg:grid-cols-2";
    } else if (boardSets.length === 3) {
      return "lg:grid lg:grid-cols-2 xl:grid-cols-3";
    }
    return "lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={clsx(
          "flex max-h-[50vh] flex-col gap-2 overflow-y-scroll scroll-smooth",
          renderAsGrid(),
        )}
        ref={scrollRef}
      >
        {boardSets.map((tileSet, tilesIdx) => (
          <div
            key={tilesIdx}
            ref={(el) => {
              dropRefs.current[tilesIdx] = el;
            }}
            className="relative flex h-30 min-h-30 w-93 items-center justify-start rounded border-2 border-gray-300 pl-2"
          >
            {tileSet.length === 0 && (
              <p className="w-full text-center text-gray-600 select-none">
                drag & drop a tile here
              </p>
            )}

            <div className="flex gap-2">
              {tileSet.map((tile, tileIdx) => (
                <Tile
                  key={tileIdx}
                  color={tile[0]}
                  number={tile[1]}
                  interactive
                  onClick={() => handleRemoveTile(tilesIdx, tileIdx)}
                />
              ))}
            </div>

            <button
              className="absolute right-2 cursor-pointer text-3xl hover:scale-105"
              title="Remove set"
              onClick={() => handleRemoveSet(tilesIdx)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      <div className="my-2 ml-5 flex items-center justify-center gap-5 sm:ml-0 sm:gap-6">
        <ColorSelector selected={editColor} setSelected={setEditColor} />

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
              "w-17 cursor-pointer rounded border-3 py-1 pl-2 text-center text-xl sm:ml-0 sm:w-13 sm:pl-0",
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

      <div className="flex items-center justify-center gap-2">
        <button
          className="text-md flex w-25 cursor-pointer items-center justify-center rounded bg-amber-50 py-2 shadow-sm duration-200 ease-out hover:bg-amber-100"
          onClick={() => setBoardSets(boardSets.concat([[]]))}
        >
          New Set
        </button>
        <button
          className="text-md flex w-25 cursor-pointer items-center justify-center rounded bg-red-300 py-2 shadow-sm duration-200 ease-out hover:bg-red-400"
          onClick={handleClearCurrent}
        >
          Clear Sets
        </button>
      </div>
    </div>
  );
}
