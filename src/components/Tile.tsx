import React from 'react';

type TileProps = {
  color: string;
  number: string;
  onClick?: () => void;
};

export default function Tile({
  color,
  number,
  onClick,
}: TileProps): React.ReactElement {
  return (
    <button
      className={`cursor-pointer hover:scale-105 ease-out duration-200 shadow-sm border-amber-200 border-3 w-17 h-28 bg-amber-100 text-3xl font-extrabold rounded-sm m-0.75 flex justify-center`}
      onClick={onClick}
    >
      <div className="my-1 shadow-[inset_5px_5px_4px_4px_rgba(0,0,0,0.05)] w-16 h-16 inset-shadow-sm rounded-full flex justify-center items-center">
        <div className={`scale-y-130 ${color}`}>{number}</div>
      </div>
    </button>
  );
}
