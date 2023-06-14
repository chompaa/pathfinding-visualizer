import { dijkstra } from "./dijkstra";
import { recursiveDivide } from "./maze";

export const PathfindingAlgorithms = {
  dijkstra: {
    title: "Dijkstra's",
    algorithm: dijkstra,
  },
};

export const MazeAlgorithms = {
  recursive_divide: {
    title: "Recursive Divide",
    algorithm: recursiveDivide,
  },
};
