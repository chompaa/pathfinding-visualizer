import { Grid, Point } from "../components/canvas";

export type PathfindingAlgorithmResult = {
  explored: Array<Point>;
  path: Array<Point>;
};

export type PathfindingAlgorithm = {
  (nodes: Grid, source: Point, target: Point): PathfindingAlgorithmResult;
};

export type MazeAlgorithm = {
  (nodes: Grid): void;
};

export type AlgorithmObject = {
  title: string;
  algorithm: PathfindingAlgorithm | MazeAlgorithm;
};

export type AlgorithmList = {
  [name: string]: AlgorithmObject;
};
