import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import { recursiveDivide } from "./maze";

export const PathfindingAlgorithms = {
  dijkstra: {
    title: "Dijkstra's",
    algorithm: dijkstra,
  },
  dfs: {
    title: "Depth first search",
    algorithm: dfs,
  },
};

export const MazeAlgorithms = {
  recursive_divide: {
    title: "Recursive Divide",
    algorithm: recursiveDivide,
  },
};
