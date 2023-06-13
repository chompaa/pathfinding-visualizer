import { PathfindingAlgorithmResult } from ".";
import { Grid, Node, Point } from "../components/canvas";
import { get2DArray, getNeighbours, pointsEqual } from "./util";

export const dijkstra = (
  nodes: Grid,
  source: Point,
  target: Point
): PathfindingAlgorithmResult => {
  const distances: Array<Array<number>> = get2DArray(
    nodes.length,
    nodes[0].length,
    Number.MAX_SAFE_INTEGER
  );

  const previous: Array<Array<Point>> = get2DArray(
    nodes.length,
    nodes[0].length,
    { x: -1, y: -1 }
  );

  let queue: Array<Point> = [];
  nodes.forEach((row, rowIndex) =>
    row.forEach((col, colIndex) => {
      if (col !== Node.Wall) {
        queue.push({ x: rowIndex, y: colIndex });
      }
    })
  );

  distances[source.x][source.y] = 0;

  const explored = [];

  while (queue.length) {
    const u: Point = queue.reduce((p, c) =>
      distances[p.x][p.y] < distances[c.x][c.y] ? p : c
    );

    explored.push(u);

    if (pointsEqual(u, target)) {
      // we've found the target, no need to keep pathing
      break;
    }

    // remove the current vertex
    queue = queue.filter((v) => !pointsEqual(u, v));

    getNeighbours(u, nodes).forEach((v) => {
      // terminate if the neighbour is not in the queue or is a wall
      if (
        !queue.some((q) => pointsEqual(v, q)) ||
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
  if ((x !== -1 && y !== -1) || pointsEqual(u, source)) {
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
