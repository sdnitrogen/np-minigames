import { ThermalFuseTile } from "@/types/ThermalFuseTile"

export const generateTile = (icons: string[]) => {
  const tile: ThermalFuseTile = {
    color: "g7",
    clicked: 0,
    icon: icons[Math.floor(Math.random() * 3)],
    clickable: "",
  }
  return tile
}

export const generateBoard = (row: number, col: number, icons: string[]) => {
  const board = Array(row)
    .fill(null)
    .map(() =>
      Array(col)
        .fill(null)
        .map(() => generateTile(icons))
    )
  return board
}
