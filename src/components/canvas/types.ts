export type Point = { x: number; y: number };
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
