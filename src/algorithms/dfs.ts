import { PathfindingAlgorithmResult } from ".";
import { Grid, Point } from "../types";
import { get2DArray, getNeighbours, pointsEqual } from "./util";

export const dfs = (
  nodes: Grid,
  source: Point,
  target: Point
): PathfindingAlgorithmResult => {
  const visited: Boolean[][] = get2DArray(nodes.length, nodes[0].length, false);

  const stack: Point[] = [source];

  const explored: Point[] = [];

  const previous: Point[][] = get2DArray(nodes.length, nodes[0].length, {
    x: -1,
    y: -1,
  });

  while (stack.length) {
    const current = stack.pop();

    if (!current || pointsEqual(current, target)) {
      break;
    }

    const { x: cx, y: cy } = current;

    if (visited[cx][cy]) {
      continue;
    }

    explored.push(current);
    visited[cx][cy] = true;

    getNeighbours(current, nodes).forEach((neighbour: Point) => {
      const { x: nx, y: ny } = neighbour;

      // terminate if the neighbour has been explored
      if (visited[nx][ny]) {
        return;
      }

      previous[nx][ny] = current;

      stack.push(neighbour);
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

  explored.splice(0, 1);

  return {
    explored: explored.reverse(),
    path: path.slice(1, path.length - 1),
  };
};
