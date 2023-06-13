import { Grid, Point } from "../components/canvas";

export type PathfindingAlgorithmResult = {
  explored: Array<Point>;
  path: Array<Point>;
};

export type PathfindingAlgorithm = {
  description: string;
  (nodes: Grid, source: Point, target: Point): PathfindingAlgorithmResult;
};

export enum PathfindingAlgorithmType {
  Dijkstra,
}
