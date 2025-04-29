import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Tile from "./Tile";

type Tiles = (string | number)[][];
type TileTuple = ["B" | "O" | "R" | "K", number | "J"];

const COLOR_CODE = {
  B: "blue-500",
  O: "yellow-500",
  R: "red-500",
  K: "black",
} as const;

const tupleToProps = ([c, n]: TileTuple) => ({
  color: COLOR_CODE[c],
  number: n === 0 ? "J" : String(n),
});

export default function Solved() {
  const { state } = useLocation() as {
    state?: { inRack?: Tiles; inBoard?: Tiles };
  };
  const navigate = useNavigate();
  const [solution, setSolution] = useState<Record<string, unknown> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const invalid = !state || !state.inRack || !state.inBoard;

  useEffect(() => {
    if (invalid) return;

    const { inRack, inBoard } = state!;
    (async () => {
      try {
        const { data } = await axios.post("http://127.0.0.1:5000/", {
          rack: inRack,
          board: inBoard,
        });
        if (!data.from_rack || !data.from_rack.length) {
          setError("No possible move can be made.");
        } else {
          setSolution(data);
        }
      } catch (e) {
        console.log(e);
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [invalid, state]);

  if (invalid) return <Navigate to="/" replace />;
  if (error)
    return (
      <p className="flex size-full items-center justify-center bg-gradient-to-b from-[#ffa9a9] to-[rgba(94,94,94,0.95)] text-center text-2xl text-red-900">
        {error}
      </p>
    );

  const renderTileSets = (sets: TileTuple[][]) =>
    sets.map((set, si) => (
      <div key={si} className="mb-2 flex">
        {set.map((t, ti) => (
          <Tile key={ti} {...tupleToProps(t)} interactive={false} />
        ))}
      </div>
    ));

  const renderTiles = (tiles: TileTuple[]) => (
    <div className="grid grid-cols-5">
      {tiles.map((t, i) => (
        <Tile key={i} {...tupleToProps(t)} interactive={false} />
      ))}
    </div>
  );

  return (
    <div className="flex h-fit min-h-full w-full flex-col items-center gap-5 overflow-hidden bg-gradient-to-b from-[#9c9c9c] to-[rgba(215,150,255,0.95)] pt-10 pb-10">
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="flex w-full items-center justify-between px-5">
            <h1 className="text-2xl font-bold">Optimal play</h1>
            <button
              onClick={() => navigate("/", { state })}
              className="rounded bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-300"
            >
              ← Back
            </button>
          </div>

          <div className="flex flex-col">
            {solution && renderTileSets(solution.best_play as TileTuple[][])}
          </div>

          <h1 className="mt-5 mb-2 text-2xl font-bold">
            Tiles used from your rack
          </h1>
          <div>
            {solution && renderTiles(solution.from_rack as TileTuple[])}
          </div>
        </>
      )}
    </div>
  );
}
