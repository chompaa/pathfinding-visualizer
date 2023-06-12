export type Location = { x: number; y: number };
export type Color = { r: number; g: number; b: number };

export enum Node {
  Empty,
  Wall,
  Start,
  End,
  Explore,
  Path,
}
export type Grid = Array<Array<Node>>;

export type AlgorithmResult = {
  explored: Array<Location>;
  path: Array<Location>;
};

export type Algorithm = {
  description: string;
  (nodes: Grid, source: Location, target: Location): AlgorithmResult;
};
