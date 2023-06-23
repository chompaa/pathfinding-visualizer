import "./app.css";

import { useRef } from "preact/hooks";
import {
  MazeAlgorithm,
  PathfindingAlgorithm,
  PathfindingAlgorithmResult,
} from "./algorithms";
import Canvas from "./components/canvas";
import Menu from "./components/menu";

import { Color, Grid, Node, Point } from "./types";

export function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const nodes = useRef<Grid>([]);
  const source = useRef<Point>({ x: -1, y: -1 });
  const target = useRef<Point>({ x: -1, y: -1 });

  const pathAnimations = useRef<Array<number>>([]);

  const COLOR_START_MAIN = { r: 148, g: 201, b: 115 };
  const COLOR_END_MAIN = { r: 255, g: 165, b: 0 };
  const COLOR_EMPTY_MAIN = { r: 248, g: 240, b: 227 };
  const COLOR_WALL_MAIN = { r: 30, g: 30, b: 30 };
  const COLOR_WALL_ALT = { r: 96, g: 96, b: 96 };
  const COLOR_EXPLORE_MAIN = { r: 87, g: 142, b: 135 };
  const COLOR_EXPLORE_ALT = { r: 148, g: 201, b: 115 };
  const COLOR_PATH_MAIN = { r: 227, g: 66, b: 52 };
  const COLOR_PATH_ALT = { r: 255, g: 165, b: 0 };

  const RECT_SIZE = 20;

  const getContext = (): CanvasRenderingContext2D | undefined => {
    if (!canvas.current) {
      return undefined;
    }

    const context = canvas.current.getContext("2d");

    if (!context) {
      return undefined;
    }

    return context;
  };

  const getNodeColors = (
    node: Node
  ): { main: Color; alt: Color | undefined } => {
    switch (node) {
      case Node.Start:
        return { main: COLOR_START_MAIN, alt: undefined };
      case Node.End:
        return { main: COLOR_END_MAIN, alt: undefined };
      case Node.Wall:
        return { main: COLOR_WALL_MAIN, alt: COLOR_WALL_ALT };
      case Node.Explore:
        return { main: COLOR_EXPLORE_MAIN, alt: COLOR_EXPLORE_ALT };
      case Node.Path:
        return { main: COLOR_PATH_MAIN, alt: COLOR_PATH_ALT };
      default:
        return { main: COLOR_EMPTY_MAIN, alt: undefined };
    }
  };

  const drawNode = (
    context: CanvasRenderingContext2D,
    point: Point,
    color: Color
  ) => {
    const { x, y } = point;
    const { r: cr, g: cg, b: cb } = color;

    context.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
    context.fillRect(x, y, RECT_SIZE, RECT_SIZE);

    const { r: er, g: eg, b: eb } = getNodeColors(Node.Empty).main;

    context.fillStyle = `rgb(${er}, ${eg}, ${eb})`;
  };

  const animateNode = (
    context: CanvasRenderingContext2D,
    point: Point,
    type: Node
  ) => {
    const { x, y } = point;
    const { main, alt } = getNodeColors(type);

    if (!alt) {
      drawNode(context, point, main);
      return;
    }

    const steps = 25;

    const dr = (alt.r - main.r) / steps;
    const dg = (alt.g - main.g) / steps;
    const db = (alt.b - main.b) / steps;

    let step = 0;

    const animation = setInterval(() => {
      const color = {
        r: Math.round(alt.r - dr * step),
        g: Math.round(alt.g - dg * step),
        b: Math.round(alt.b - db * step),
      };
      drawNode(context, point, color);

      const node = nodes.current[x / RECT_SIZE][y / RECT_SIZE];

      if (step === steps || node !== type) {
        clearInterval(animation);
        drawNode(context, point, getNodeColors(node).main);
      }

      step++;
    }, 20);

    if (type === Node.Explore || type === Node.Path) {
      pathAnimations.current.push(animation);
    }
  };

  const clearPathAnimations = () => {
    pathAnimations.current.forEach((animation: number) =>
      clearInterval(animation)
    );
  };

  const removeNodes = (types: Array<Node>) => {
    const context = getContext();

    if (!context) {
      return;
    }

    if (types.includes(Node.Explore)) {
      clearPathAnimations();
    }

    nodes.current = nodes.current.map((row: Array<Node>, rowIndex: number) => {
      return row.map((col: Node, colIndex: number) => {
        if (!types.includes(col)) {
          return col;
        }

        drawNode(
          context,
          { x: rowIndex * RECT_SIZE, y: colIndex * RECT_SIZE },
          getNodeColors(Node.Empty).main
        );

        return Node.Empty;
      });
    });
  };

  const solvePath = (pathfindingAlgorithm: PathfindingAlgorithm) => {
    if (!canvas.current) {
      return;
    }

    const context: CanvasRenderingContext2D | null =
      canvas.current.getContext("2d");

    if (!context) {
      return;
    }

    const { explored, path }: PathfindingAlgorithmResult = pathfindingAlgorithm(
      [...nodes.current],
      source.current,
      target.current
    );

    const animationTime = 20;

    const animation = setInterval(() => {
      if (explored.length) {
        const { x, y } = explored.pop() as Point;

        nodes.current[x][y] = Node.Explore;

        animateNode(
          context,
          { x: x * RECT_SIZE, y: y * RECT_SIZE },
          Node.Explore
        );
      } else if (path.length) {
        const { x, y } = path.pop() as Point;

        nodes.current[x][y] = Node.Path;

        animateNode(context, { x: x * RECT_SIZE, y: y * RECT_SIZE }, Node.Path);
      } else {
        clearInterval(animation);
      }
    }, animationTime);

    pathAnimations.current.push(animation);
  };

  const generateMaze = (mazeAlgorithm: MazeAlgorithm) => {
    const context = getContext();

    if (!context) {
      return;
    }

    mazeAlgorithm(nodes.current);

    const wallColor = getNodeColors(Node.Wall).main;

    nodes.current.forEach((row: Array<Node>, rowIndex: number) =>
      row.forEach((col: Node, colIndex: number) => {
        if (col !== Node.Wall) {
          return;
        }

        drawNode(
          context,
          { x: rowIndex * RECT_SIZE, y: colIndex * RECT_SIZE },
          wallColor
        );
      })
    );
  };

  return (
    <div class="container">
      <Menu
        solvePath={solvePath}
        generateMaze={generateMaze}
        removeNodes={removeNodes}
      ></Menu>
      <Canvas
        RECT_SIZE={RECT_SIZE}
        canvas={canvas}
        nodes={nodes}
        source={source}
        target={target}
        getNodeColors={getNodeColors}
        drawNode={drawNode}
        animateNode={animateNode}
      ></Canvas>
    </div>
  );
}
