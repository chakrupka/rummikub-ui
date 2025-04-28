import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
        const { data } = await axios.post("http://localhost:5000", {
          rack: inRack,
          board: inBoard,
        });
        setSolution(data);
        console.log(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [invalid, state]);

  if (invalid) return <Navigate to="/" replace />;
  if (error) return <p className="text-red-600">{error}</p>;

  const renderTileSets = (sets: TileTuple[][]) =>
    sets.map((set, si) => (
      <div key={si} className="mb-2 flex">
        {set.map((t, ti) => (
          <Tile key={ti} {...tupleToProps(t)} interactive={false} />
        ))}
      </div>
    ));

  const renderTiles = (tiles: TileTuple[]) => (
    <div className="flex">
      {tiles.map((t, i) => (
        <Tile key={i} {...tupleToProps(t)} interactive={false} />
      ))}
    </div>
  );

  return (
    <div className="flex size-full flex-col items-center justify-center bg-gradient-to-b from-[#9c9c9c] to-[rgba(215,150,255,0.95)]">
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <h1 className="mb-2 text-2xl font-bold">Optimal play</h1>
          <div className="flex gap-4">
            {solution && renderTileSets(solution.best_play as TileTuple[][])}
          </div>
          <h1 className="mt-5 mb-2 text-2xl font-bold">
            Tiles used from your rack
          </h1>
          <div className="flex gap-2">
            {solution && renderTiles(solution.from_rack as TileTuple[])}
          </div>
        </>
      )}
    </div>
  );
}
