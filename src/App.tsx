import { useState } from 'react';
import Tile from './components/Tile';
import ColorSelector from './components/ColorSelector';

export default function App() {
  const [view, setView] = useState<'board' | 'rack'>('board');
  const [editColor, setEditColor] = useState('blue-500');
  const [editNumber, setEditNumber] = useState('1');
  const [boardTiles, setBoardTiles] = useState<
    { color: string; number: string }[]
  >([]);
  const [rackTiles, setRackTiles] = useState<
    { color: string; number: string }[]
  >([]);
  const numberOptions = [...Array(13)]
    .map((_, i) => (i + 1).toString())
    .concat('J');

  const activeTiles = view === 'board' ? boardTiles : rackTiles;
  const setActiveTiles = view === 'board' ? setBoardTiles : setRackTiles;

  const addTile = () =>
    setActiveTiles((prev) => [
      ...prev,
      { color: editColor, number: editNumber },
    ]);

  const removeTile = (index: number) =>
    setActiveTiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="gap-5 pt-10 size-full flex flex-col items-center bg-gradient-to-b from-[#bdbdbd] to-[#8b8b8b]">
      <h1 className="font-bold text-3xl">
        Rummikub Optimal Play Solver (ROPS)
      </h1>
      <p className="mb-5">Made with ❤️ by Cha Krupka</p>
      <div className="flex gap-4 mb-1">
        <button
          onClick={() => setView('board')}
          className={`cursor-pointer px-4 py-2 rounded ${
            view === 'board' ? 'bg-white shadow' : 'bg-gray-300'
          }`}
        >
          Board
        </button>
        <button
          onClick={() => setView('rack')}
          className={`cursor-pointer px-4 py-2 rounded ${
            view === 'rack' ? 'bg-white shadow' : 'bg-gray-300'
          }`}
        >
          Rack
        </button>
      </div>

      <div className="flex items-center justify-center">
        {activeTiles.map((tile, index) => (
          <Tile
            key={index}
            color={`text-${tile.color}`}
            number={tile.number}
            onClick={() => removeTile(index)}
          />
        ))}
        {activeTiles.length === 0 && <div className="h-29.5"></div>}
      </div>

      <div className="ml-2 flex items-center justify-center gap-3">
        <ColorSelector selected={editColor} setSelected={setEditColor} />
        <Tile
          color={`text-${editColor}`}
          number={editNumber}
          onClick={addTile}
        />
        <label className="flex flex-col gap-1">
          <select
            onChange={(e) => setEditNumber(e.target.value)}
            className={`cursor-pointer border-3 border-${editColor} p-2 rounded text-2xl font-bold text-${editColor}`}
          >
            {numberOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h2 className="underline text-2xl mt-10">Instructions</h2>
      <p className="max-w-[30%] text-center">
        Enter the tiles on the board and in your rack. The solver will return
        the best possible move (most tiles used).
      </p>
      <p className="max-w-[30%] text-center">
        Change tile color with the button on the left of the tile, and the
        number from the dropdown on the right.
      </p>
      <p className="max-w-[30%] text-center">
        Click on the middle tile to add it to the list. Click on any tile in the
        list to remove it.
      </p>
      <p className="max-w-[30%] text-center">
        Switch between board tiles and rack tiles with the buttons above.
      </p>
    </div>
  );
}
