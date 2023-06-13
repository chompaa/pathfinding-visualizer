import { useEffect, useRef, useState } from "preact/hooks";

import { Color, Grid, Node, Point } from ".";

import {
  PathfindingAlgorithm,
  PathfindingAlgorithmResult,
} from "../../algorithms";

const Canvas = ({
  algorithm,
}: {
  algorithm: PathfindingAlgorithm | undefined;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const COLOR_START_MAIN = { r: 255, g: 0, b: 0 };
  const COLOR_END_MAIN = { r: 0, g: 0, b: 255 };
  const COLOR_EMPTY_MAIN = { r: 255, g: 255, b: 255 };
  const COLOR_WALL_MAIN = { r: 0, g: 0, b: 0 };
  const COLOR_WALL_ALT = { r: 96, g: 96, b: 96 };
  const COLOR_EXPLORE_MAIN = { r: 67, g: 176, b: 67 };
  const COLOR_EXPLORE_ALT = { r: 89, g: 125, b: 53 };
  const COLOR_PATH_MAIN = { r: 277, g: 66, b: 52 };
  const COLOR_PATH_ALT = { r: 242, g: 133, b: 0 };

  const source = useRef<Point>({ x: -1, y: -1 });
  const target = useRef<Point>({ x: -1, y: -1 });
  const nodes = useRef<Grid>([]);
  const [lastPoint, setLastPoint] = useState<Point>({ x: -1, y: -1 });
  const [pointerDown, setPointerDown] = useState<boolean>(false);

  const RECT_SIZE = 25;

  const getRowCount = (canvas: HTMLCanvasElement): number => {
    return canvas.width / RECT_SIZE;
  };

  const getColumnCount = (canvas: HTMLCanvasElement): number => {
    return canvas.height / RECT_SIZE;
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
    const { r, g, b } = color;

    context.beginPath();
    context.fillStyle = `rgb(${r}, ${g}, ${b})`;
    context.rect(x, y, RECT_SIZE, RECT_SIZE);
    context.fill();
    context.stroke();
    context.closePath();
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

    const steps = 50;

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
        drawNode(context, point, main);
      }

      step++;
    }, 20);
  };

  const drawGrid = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const rows = getRowCount(canvas);
    const columns = getColumnCount(canvas);

    context.strokeStyle = "black";

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const point = { x: i * RECT_SIZE, y: j * RECT_SIZE };
        const color = getNodeColors(nodes.current[i][j]).main;

        drawNode(context, point, color);
      }
    }
  };

  const setNode = (e: MouseEvent, point: Point) => {
    const { x, y } = point;

    const node = nodes.current[x][y];

    if (node === Node.Start || node === Node.End) {
      return;
    }

    const canvas = e.target as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const type = node === Node.Wall ? Node.Empty : Node.Wall;

    nodes.current[x][y] = type;

    if (type === Node.Wall) {
      animateNode(context, { x: x * RECT_SIZE, y: y * RECT_SIZE }, type);
    } else {
      drawNode(
        context,
        { x: x * RECT_SIZE, y: y * RECT_SIZE },
        getNodeColors(type).main
      );
    }
  };

  const solve = (pathfindingAlgorithm: PathfindingAlgorithm) => {
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
    const pathDelayTime = 1000;
    let currentTime = 0;

    explored.forEach((point) => {
      const { x, y } = point;

      nodes.current[x][y] = Node.Explore;

      setTimeout(
        () =>
          animateNode(
            context,
            { x: x * RECT_SIZE, y: y * RECT_SIZE },
            Node.Explore
          ),
        currentTime
      );

      currentTime += animationTime;
    });

    setTimeout(() => {
      currentTime = 0;
      path.forEach((point) => {
        const { x, y } = point;

        nodes.current[x][y] = Node.Path;

        setTimeout(
          () =>
            animateNode(
              context,
              { x: x * RECT_SIZE, y: y * RECT_SIZE },
              Node.Path
            ),
          currentTime
        );
        currentTime += animationTime;
      });
    }, animationTime * explored.length + pathDelayTime);
  };

  const getPoint = (e: MouseEvent): Point => {
    const target = e.target as HTMLCanvasElement;
    const rect = target.getBoundingClientRect();

    const scaleX = target.width / rect.width;
    const scaleY = target.height / rect.height;

    const left = (e.clientX - rect.left) * scaleX;
    const top = (e.clientY - rect.top) * scaleY;

    return {
      x: Math.floor(left / RECT_SIZE),
      y: Math.floor(top / RECT_SIZE),
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    const point = getPoint(e);
    const { x, y } = point;

    if (x === lastPoint.x && y === lastPoint.y) {
      return;
    }

    setLastPoint(point);

    if (!pointerDown) {
      return;
    }

    setNode(e, point);
  };

  const handleMouseDown = (e: MouseEvent) => {
    const point = getPoint(e);

    setNode(e, point);
    setPointerDown(true);
  };

  const handleMouseUp = (_: MouseEvent) => {
    setPointerDown(false);
  };

  const getRandomPoint = (): Point => {
    return {
      x: Math.floor(Math.random() * nodes.current.length),
      y: Math.floor(Math.random() * nodes.current[0].length),
    };
  };

  useEffect(() => {
    if (!algorithm || !nodes.current.length) {
      console.log(algorithm);
      return;
    }

    solve(algorithm);
  }, [algorithm]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvas.current) {
        return;
      }

      const context: CanvasRenderingContext2D | null =
        canvas.current.getContext("2d");

      if (!context) {
        return;
      }

      // ensure the canvas is made up of fixed increments of RECT_SIZE
      canvas.current.width =
        Math.floor(canvas.current.clientWidth / RECT_SIZE) * RECT_SIZE;
      canvas.current.height =
        Math.floor(canvas.current.clientHeight / RECT_SIZE) * RECT_SIZE;

      const rowCount: number = getRowCount(canvas.current);
      const columnCount: number = getColumnCount(canvas.current);

      nodes.current = new Array(rowCount)
        .fill(Node.Empty)
        .map(() => new Array(columnCount).fill(Node.Empty));

      source.current = getRandomPoint();
      target.current = getRandomPoint();

      const { x: sx, y: sy } = source.current;
      const { x: tx, y: ty } = target.current;

      nodes.current[sx][sy] = Node.Start;
      nodes.current[tx][ty] = Node.End;

      drawGrid(canvas.current, context);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div class="canvas-container">
      <canvas
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        ref={canvas}
      ></canvas>
    </div>
  );
};

export default Canvas;
