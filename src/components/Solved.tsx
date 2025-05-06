import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { TileColor, TileDataList, TileDataSets } from "../types/types";
import Tile from "./Tile";

export default function Solved() {
  const { state } = useLocation() as {
    state?: { boardSets?: TileDataSets; rackTiles?: TileDataList };
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<{
    best_play: TileDataSets | undefined;
    from_rack: TileDataList | undefined;
  }>();
  const invalid = !state || !state.boardSets || !state.rackTiles;

  useEffect(() => {
    if (invalid) return;

    const URL = {
      dev: "http://127.0.0.1:5000/",
      prod: "https://rummikub.onrender.com",
    };

    const { boardSets, rackTiles } = state!;
    (async () => {
      try {
        const { data } = await axios.post(URL.prod, {
          board: boardSets,
          rack: rackTiles,
        });
        if (!data.from_rack || !data.from_rack.length) {
          setError("No moves can be made with your rack.");
        } else {
          data.from_rack.sort(tileComparator);
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
      <p className="flex size-full items-center justify-center bg-gradient-to-b from-[rgba(94,94,94,0.95)] to-[#ffa9a9] text-center text-2xl text-red-900">
        {error}
      </p>
    );

  const tileComparator = (
    [colorA, valA]: [TileColor, string],
    [colorB, valB]: [TileColor, string],
  ): number => {
    const face = (v: string) => (v === "J" ? 14 : parseInt(v, 10));
    const numA = face(valA),
      numB = face(valB);
    if (numA !== numB) return numA - numB;
    return colorA.localeCompare(colorB);
  };

  const renderAsGrid = (boardSets: TileDataSets) => {
    if (boardSets.length <= 1) {
      return "";
    } else if (boardSets.length === 2) {
      return "md:grid md:grid-cols-2";
    }
    return "md:grid md:grid-cols-2 xl:grid-cols-3";
  };

  return (
    <div className="flex h-fit min-h-full w-full flex-col items-center gap-5 bg-gradient-to-b from-[#9c9c9c] to-[rgba(215,150,255,0.95)] px-10 py-10">
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="flex w-full items-center justify-center px-5">
            <h1 className="text-2xl font-bold">Optimal play</h1>
            <button
              onClick={() => navigate("/", { state })}
              className="absolute top-5 left-5 cursor-pointer rounded bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-300"
            >
              ← Back
            </button>
          </div>

          <div className="flex flex-col">
            {solution && solution.best_play && (
              <div
                className={clsx(
                  "flex flex-col gap-2",
                  renderAsGrid(solution.best_play),
                )}
              >
                {solution.best_play.map((tileSet, tilesIdx) => (
                  <div
                    key={tilesIdx}
                    className="flex w-93 items-center justify-start"
                  >
                    <div className="flex gap-2">
                      {tileSet.map((tile) => (
                        <Tile
                          color={tile[0]}
                          number={tile[1]}
                          interactive={false}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h1 className="mt-5 mb-2 text-center text-2xl font-bold">
              Tiles used from your rack
            </h1>
            {solution && solution.from_rack && (
              <div className="relative flex items-center justify-center">
                <div className="flex flex-wrap gap-2 px-2 py-2">
                  {solution.from_rack.map((tile, idx) => (
                    <Tile
                      key={idx}
                      color={tile[0]}
                      number={tile[1]}
                      interactive={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
