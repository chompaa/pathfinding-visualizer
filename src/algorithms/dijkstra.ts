import { Node, Grid, Location, AlgorithmResult } from "../types";

function get2DArray(n: number, m: number, fill: any) {
  return Array(n)
    .fill(fill)
    .map(() => Array(m).fill(fill));
}

function getNeighbours(location: Location, grid: Grid): Array<Location> {
  const { x, y } = location;

  const neighbours = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  return neighbours
    .filter(
      ([dirX, dirY]) =>
        dirX + x >= 0 &&
        dirX + x < grid.length &&
        dirY + y >= 0 &&
        dirY + y < grid[0].length
    )
    .map(([dirX, dirY]) => ({
      x: dirX + x,
      y: dirY + y,
    }));
}

const locationsEqual = (a: Location, b: Location) => {
  return a.x === b.x && a.y === b.y;
};

export const dijkstra = (
  nodes: Grid,
  source: Location,
  target: Location
): AlgorithmResult => {
  const distances: Array<Array<number>> = get2DArray(
    nodes.length,
    nodes[0].length,
    Number.MAX_SAFE_INTEGER
  );

  const previous: Array<Array<Location>> = get2DArray(
    nodes.length,
    nodes[0].length,
    { x: -1, y: -1 }
  );

  let queue: Array<Location> = [];
  nodes.forEach((row, rowIndex) =>
    row.forEach((col, colIndex) => {
      if (col !== Node.Wall) {
        queue.push({ x: rowIndex, y: colIndex });
      }
    })
  );

  console.log(queue.length);

  distances[source.x][source.y] = 0;

  const explored = [];

  while (queue.length) {
    const u: Location = queue.reduce((p, c) =>
      distances[p.x][p.y] < distances[c.x][c.y] ? p : c
    );

    explored.push(u);

    if (locationsEqual(u, target)) {
      // we've found the target, no need to keep pathing
      break;
    }

    // remove the current vertex
    queue = queue.filter((v) => !locationsEqual(u, v));

    getNeighbours(u, nodes).forEach((v) => {
      // terminate if the neighbour is not in the queue or is a wall
      if (
        !queue.some((q) => locationsEqual(v, q)) ||
        nodes[v.x][v.y] === Node.Wall
      ) {
        return;
      }

      // distance between every node is 1
      const alt = distances[u.x][u.y] + 1;

      if (alt < distances[v.x][v.y]) {
        distances[v.x][v.y] = alt;
        previous[v.x][v.y] = u;
      }
    });
  }

  const path = [];
  let u = { ...target };
  const { x, y } = previous[u.x][u.y];

  // build path to source (backtrack)
  if ((x !== -1 && y !== -1) || locationsEqual(u, source)) {
    while (u.x !== -1 && u.y !== -1) {
      path.push(u);
      u = { ...previous[u.x][u.y] };
    }
  }

  return {
    explored: explored.slice(1, explored.length - 1),
    path: path.reverse().slice(1, path.length - 1),
  };
};

dijkstra.description = "Dijkstra's Algorithm";
