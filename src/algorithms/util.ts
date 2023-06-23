import { Grid, Node, Point } from "../types";

export const get2DArray = (n: number, m: number, fill: any) => {
  return Array(n)
    .fill(fill)
    .map(() => Array(m).fill(fill));
};

export const getNeighbours = (point: Point, grid: Grid): Array<Point> => {
  const { x, y } = point;

  const neighbours = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  return neighbours
    .filter(
      ([dirX, dirY]) =>
        dirX + x >= 0 &&
        dirX + x < grid.length &&
        dirY + y >= 0 &&
        dirY + y < grid[0].length &&
        grid[dirX + x][dirY + y] !== Node.Wall
    )
    .map(([dirX, dirY]) => ({
      x: dirX + x,
      y: dirY + y,
    }));
};

export const pointsEqual = (a: Point, b: Point) => {
  return a.x === b.x && a.y === b.y;
};

export const randomInteger = (bound: number) => {
  return Math.floor(Math.random() * bound);
};
