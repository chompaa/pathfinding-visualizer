import { MutableRef, Ref, useEffect, useState } from "preact/hooks";

import { Grid, Node, Point } from ".";

const Canvas = ({
  RECT_SIZE,
  canvas,
  nodes,
  source,
  target,
  getNodeColors,
  drawNode,
  animateNode,
}: {
  RECT_SIZE: number;
  canvas: Ref<HTMLCanvasElement>;
  nodes: MutableRef<Grid>;
  source: MutableRef<Point>;
  target: MutableRef<Point>;
  getNodeColors: Function;
  drawNode: Function;
  animateNode: Function;
}) => {
  const [lastPoint, setLastPoint] = useState<Point>({ x: -1, y: -1 });
  const [pointerDown, setPointerDown] = useState<boolean>(false);

  const COLOR_HOVER = { r: 218, g: 210, b: 197 };

  const getRowCount = (canvas: HTMLCanvasElement): number => {
    return canvas.width / RECT_SIZE;
  };

  const getColumnCount = (canvas: HTMLCanvasElement): number => {
    return canvas.height / RECT_SIZE;
  };

  const drawGrid = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    nodes: Grid
  ) => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const rows = getRowCount(canvas);
    const columns = getColumnCount(canvas);

    context.strokeStyle = "black";

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const point = { x: i * RECT_SIZE, y: j * RECT_SIZE };
        const color = getNodeColors(nodes[i][j]).main;

        drawNode(context, point, color);
      }
    }
  };

  const drawCursor = (context: CanvasRenderingContext2D, point: Point) => {
    const lineWidth = 4;

    let { x, y } = point;
    const { r: hr, g: hg, b: hb } = COLOR_HOVER;

    context.strokeStyle = `rgb(${hr}, ${hg}, ${hb})`;
    context.lineWidth = lineWidth;
    context.lineCap = "square";

    context.strokeRect(
      x + lineWidth / 2,
      y + lineWidth / 2,
      RECT_SIZE - lineWidth,
      RECT_SIZE - lineWidth
    );

    const length = RECT_SIZE / 2.5;

    const { r: er, eg, eb } = getNodeColors(Node.Empty).main;

    context.fillStyle = `rgb(${er}, ${eg}, ${eb})`;

    context.fillRect(x + length, y, RECT_SIZE - 2 * length, RECT_SIZE);
    context.fillRect(x, y + length, RECT_SIZE, RECT_SIZE - 2 * length);
  };

  const setNode = (e: MouseEvent, point: Point) => {
    if (!nodes.current) {
      return;
    }

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

    const canvas = e.target as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (x === lastPoint.x && y === lastPoint.y) {
      return;
    }

    const { x: lx, y: ly } = lastPoint;
    setLastPoint(point);

    if (!pointerDown) {
      // draw cursor on current node
      if (nodes.current[x][y] === Node.Empty) {
        drawCursor(context, { x: x * RECT_SIZE, y: y * RECT_SIZE });
      }

      // restore previous node
      if (nodes.current[lx][ly] === Node.Empty) {
        drawNode(
          context,
          { x: lastPoint.x * RECT_SIZE, y: lastPoint.y * RECT_SIZE },
          getNodeColors(nodes.current[lastPoint.x][lastPoint.y]).main
        );
      }

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

  const getRandomPoint = (nodes: Grid): Point => {
    return {
      x: Math.floor(Math.random() * nodes.length),
      y: Math.floor(Math.random() * nodes[0].length),
    };
  };

  useEffect(() => {
    const handleResize = () => {
      if (!canvas.current || !nodes.current) {
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

      source.current = getRandomPoint(nodes.current);
      target.current = getRandomPoint(nodes.current);

      const { x: sx, y: sy } = source.current;
      const { x: tx, y: ty } = target.current;

      nodes.current[sx][sy] = Node.Start;
      nodes.current[tx][ty] = Node.End;

      drawGrid(canvas.current, context, nodes.current);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div class="canvas-container" style={{ borderWidth: `${RECT_SIZE}px` }}>
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
