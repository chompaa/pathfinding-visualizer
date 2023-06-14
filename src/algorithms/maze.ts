import { Grid, Node, Point } from "../components/canvas";
import { randomInteger } from "./util";

enum Orientation {
  Horizontal,
  Vertical,
}

export const recursiveDivide = (nodes: Grid): void => {
  const size = {
    width: nodes.length,
    height: nodes[0].length,
  };

  divide(nodes, { x: 0, y: 0 }, size, getOrientation(size.width, size.height));
};

const getOrientation = (width: number, height: number) => {
  if (width < height) {
    return Orientation.Horizontal;
  } else if (height < width) {
    return Orientation.Vertical;
  } else {
    return randomInteger(2) === 0
      ? Orientation.Horizontal
      : Orientation.Vertical;
  }
};

const divide = (
  nodes: Grid,
  point: Point,
  size: { width: number; height: number },
  orientation: Orientation
) => {
  const { width, height } = size;

  if (width < 2 || height < 2) {
    return;
  }

  const isHorizontal = orientation === Orientation.Horizontal;

  const { x, y } = point;

  const trueWidth = (width - 1) / 2;
  const trueHeight = (height - 1) / 2;

  let wall = {
    x: x + (isHorizontal ? 0 : 2 * randomInteger(trueWidth) + 1),
    y: y + (isHorizontal ? 2 * randomInteger(trueHeight) + 1 : 0),
  };

  const passage = {
    x: wall.x + (isHorizontal ? 2 * randomInteger(trueWidth) : 0),
    y: wall.y + (isHorizontal ? 0 : 2 * randomInteger(trueHeight)),
  };

  const direction = {
    x: isHorizontal ? 1 : 0,
    y: isHorizontal ? 0 : 1,
  };

  const length = isHorizontal ? width : height;

  for (let _ = 0; _ < length; _++) {
    if (
      (wall.x !== passage.x || wall.y !== passage.y) &&
      nodes[wall.x][wall.y] === Node.Empty
    ) {
      nodes[wall.x][wall.y] = Node.Wall;
    }

    wall.x += direction.x;
    wall.y += direction.y;
  }

  let neighbour = {
    x: x,
    y: y,
  };

  let s = {
    width: isHorizontal ? width : wall.x - x,
    height: isHorizontal ? wall.y - y : height,
  };

  divide(nodes, neighbour, s, getOrientation(s.width, s.height));

  neighbour = {
    x: isHorizontal ? x : wall.x + 1,
    y: isHorizontal ? wall.y + 1 : y,
  };

  s = {
    width: isHorizontal ? width : x + width - wall.x - 1,
    height: isHorizontal ? y + height - wall.y - 1 : height,
  };

  divide(nodes, neighbour, s, getOrientation(s.width, s.height));
};
