import { Grid, Point } from "../components/canvas";

export type PathfindingAlgorithmResult = {
  explored: Array<Point>;
  path: Array<Point>;
};

export type PathfindingAlgorithm = {
  (nodes: Grid, source: Point, target: Point): PathfindingAlgorithmResult;
};

export enum PathfindingAlgorithmType {
  Dijkstra,
}

export type PathfindingAlgorithmObject = {
  title: string;
  algorithm: PathfindingAlgorithm;
};

export type PathfindingAlgorithmList = {
  [name: string]: PathfindingAlgorithmObject;
};
