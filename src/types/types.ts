export type StyleColor = "blue-500" | "yellow-500" | "red-500" | "black";
export type TileColor = "B" | "O" | "R" | "K"
export type TileDataSets= TileDataList[]
export type TileDataList = TileData[];
export type TileData = [TileColor, string]