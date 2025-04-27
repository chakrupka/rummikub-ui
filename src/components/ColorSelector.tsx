import { useEffect, useRef, useState } from 'react';

type CustomSelectorProps = {
  selected: string;
  setSelected: (value: string) => void;
};

export default function ColorSelector({
  selected,
  setSelected,
}: CustomSelectorProps): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const colorOptions = ['blue-500', 'yellow-500', 'red-500', 'black'];
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className={`bg-${selected} rounded-3xl h-15 w-15 flex justify-between items-center text-2xl font-bold cursor-pointer`}
      ></button>

      {open && (
        <div className="absolute mt-3 w-15 font-bold rounded-lg overflow-hidden shadow-lg ">
          <div>
            {colorOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                }}
                className={`bg-${option} block w-full text-left h-10 hover:opacity-50 cursor-pointer`}
              ></button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
