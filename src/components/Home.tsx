import clsx from "clsx";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TileDataList, TileDataSets } from "../types/types";
import BoardSets from "./BoardSets";
import RackTiles from "./RackTiles";

export default function Home() {
  const navigate = useNavigate();
  const { state: navState } = useLocation() as {
    state?: { boardSets?: TileDataSets; rackTiles?: TileDataList };
  };
  const [viewingSets, setViewingSets] = useState(true);
  const [boardSets, setBoardSets] = useState<TileDataSets>(
    navState?.boardSets ?? [[]],
  );
  const [rackTiles, setRackTiles] = useState<TileDataList>(
    navState?.rackTiles ?? [],
  );

  return (
    <div className="flex h-fit min-h-full w-full flex-col items-center justify-start gap-2 overflow-hidden bg-gradient-to-b from-[#9c9c9c] to-[rgba(215,150,255,0.95)] pt-10 pb-10">
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

      <div>
        <div className="flex items-center justify-center gap-2">
          <button
            className={clsx(
              "w-25 cursor-pointer rounded px-5 py-2 duration-75 ease-out",
              viewingSets ? "bg-purple-300 shadow-sm" : "bg-[#bbbbbb]",
            )}
            onClick={() => setViewingSets(true)}
          >
            Board
          </button>
          <button
            className={clsx(
              "w-25 cursor-pointer rounded px-5 py-2 duration-75 ease-out",
              !viewingSets ? "bg-purple-300 shadow-sm" : "bg-[#bbbbbb]",
            )}
            onClick={() => setViewingSets(false)}
          >
            Rack
          </button>
        </div>
      </div>

      {viewingSets && (
        <BoardSets boardSets={boardSets} setBoardSets={setBoardSets} />
      )}
      {!viewingSets && (
        <RackTiles rackTiles={rackTiles} setRackTiles={setRackTiles} />
      )}

      <button
        className={clsx(
          "w-52 rounded px-5 py-2 text-black shadow duration-200 ease-out",
          rackTiles.length >= 1 || boardSets[0]?.length >= 3
            ? "cursor-pointer bg-green-200 hover:bg-green-400"
            : "pointer-events-none bg-gray-300 text-gray-400",
        )}
        onClick={() => navigate("/solved", { state: { boardSets, rackTiles } })}
      >
        Solve
      </button>

      <h2 className="mt-10 text-2xl underline">Instructions</h2>
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
