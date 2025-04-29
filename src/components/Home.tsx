import clsx from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ColorSelector from "./ColorSelector";
import Tile from "./Tile";

type Color = "blue-500" | "yellow-500" | "red-500" | "black";

const borderText = (c: Color) =>
  clsx(
    c === "black" ? "border-black" : `border-${c}`,
    c === "black" ? "text-black" : `text-${c}`,
  );

export default function Home() {
  const [view, setView] = useState<"board" | "rack">("board");
  const [editColor, setEditColor] = useState<Color>("blue-500");
  const [editNumber, setEditNumber] = useState("1");
  const [boardTiles, setBoardTiles] = useState<
    { color: Color; number: string }[]
  >([]);
  const [rackTiles, setRackTiles] = useState<
    { color: Color; number: string }[]
  >([]);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const numberOptions = [...Array(13).keys()]
    .map((i) => `${i + 1}`)
    .concat("J");

  const activeTiles = view === "board" ? boardTiles : rackTiles;
  const setActiveTiles = view === "board" ? setBoardTiles : setRackTiles;

  useLayoutEffect(() => {
    const c = scrollRef.current;
    if (!c) return;
    c.scrollTo({
      left: c.scrollWidth,
      behavior: "smooth",
    });
  }, [activeTiles.length]);

  const addTile = () =>
    setActiveTiles((prev) => [
      ...prev,
      { color: editColor, number: editNumber },
    ]);

  const removeTile = (index: number) =>
    setActiveTiles((prev) => prev.filter((_, i) => i !== index));

  const handleSolve = () => {
    if (rackTiles.length < 3) {
      window.alert("Your rack must have at least three tiles");
      return;
    }

    const colorMap = {
      "blue-500": "B",
      "yellow-500": "O",
      "red-500": "R",
      black: "K",
    } as const;

    const inRack = rackTiles.map((t) => [
      colorMap[t.color],
      t.number === "J" ? 0 : parseInt(t.number, 10),
    ]);
    const inBoard = boardTiles.map((t) => [
      colorMap[t.color],
      t.number === "J" ? 0 : parseInt(t.number, 10),
    ]);

    console.log("@Home:", { inRack, inBoard });
    navigate("/solved", { state: { inRack, inBoard } });
  };

  return (
    <div className="flex h-fit min-h-full w-full flex-col items-center gap-5 overflow-hidden bg-gradient-to-b from-[#9c9c9c] to-[rgba(215,150,255,0.95)] pt-10 pb-10">
      <h1 className="text-center text-3xl font-bold">
        Rummikub Optimal Play Solver (ROPS)
      </h1>
      <p className="mb-0">
        Made with ❤️ by{" "}
        <a
          href="https://www.linkedin.com/in/cha-krupka/"
          className="hover:font-bold"
        >
          Cha
        </a>{" "}
        (
        <a
          href="https://github.com/chakrupka/rummikub-ui"
          className="underline"
        >
          frontend
        </a>
        ,{" "}
        <a href="https://github.com/chakrupka/rummikub" className="underline">
          backend
        </a>
        )
      </p>
      <div className="mb-1 flex gap-3">
        {(["board", "rack"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={clsx(
              "w-25 cursor-pointer rounded px-5 py-2 duration-75 ease-in",
              view === v ? "bg-blue-300 shadow-lg" : "bg-[#bbbbbb]",
            )}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
      <div
        ref={scrollRef}
        className="flex max-w-[90%] justify-start overflow-x-auto overflow-y-hidden scroll-smooth pb-3"
      >
        <div className="relative z-10 -mb-3 flex items-center pb-3">
          {activeTiles.map((t, i) => (
            <Tile
              key={i}
              color={t.color}
              number={t.number}
              onClick={() => removeTile(i)}
              interactive
            />
          ))}
        </div>
        {activeTiles.length === 0 && <div className="h-29.5"></div>}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center pb-15 text-3xl text-gray-500 md:pb-[30%] lg:pb-[30%]">
          {view.toUpperCase()} TILES
        </span>
      </div>
      <div className="ml-5 flex items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-3">
          <ColorSelector selected={editColor} setSelected={setEditColor} />
          <p className="text-center">Change color</p>
        </div>
        <Tile
          color={editColor}
          number={editNumber}
          onClick={addTile}
          interactive={true}
        />
        <div className="flex flex-col items-center gap-3">
          <label>
            <select
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value)}
              className={clsx(
                "cursor-pointer rounded border-3 p-2 text-2xl",
                borderText(editColor),
              )}
            >
              {numberOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <p className="-mb-2 pt-1 text-center">Change number</p>
        </div>
      </div>
      <p className="-mt-2">Click the tile to add it to the list</p>
      <div className="flex gap-2">
        <button
          className="mt-2 cursor-pointer rounded bg-red-400 px-5 py-2 text-2xl text-black shadow duration-200 ease-out hover:bg-red-600"
          onClick={() => setActiveTiles([])}
        >
          Clear
        </button>
        <button
          className="mt-2 cursor-pointer rounded bg-white px-5 py-2 text-2xl text-black shadow duration-200 ease-out hover:bg-green-400"
          onClick={handleSolve}
        >
          Solve
        </button>
      </div>
      <h2 className="mt-5 text-2xl underline">Instructions</h2>
      <p className="w-[80%] max-w-[600] text-center">
        Enter the tiles on the board and in your rack. The solver will return
        the best possible move (most tiles used).
      </p>
      <p className="w-[80%] max-w-[600] text-center">
        Click on any tile in the list to remove it.
      </p>
      <p className="w-[80%] max-w-[600] text-center">
        Switch between board tiles and rack tiles with the buttons above.
      </p>
    </div>
  );
}
