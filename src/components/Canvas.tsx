import { useState, useRef, useEffect } from "preact/hooks";

import { Location, Size, Color } from "./types";

function Canvas() {
  const canvas = useRef<HTMLCanvasElement>(null);

  const COLOR_EMPTY_MAIN = { r: 255, g: 255, b: 255 };
  const COLOR_WALL_MAIN = { r: 0, g: 0, b: 0 };
  const COLOR_WALL_ALT = { r: 96, g: 96, b: 96 };

  enum Node {
    Empty,
    Wall,
    Start,
    End,
  }

  const nodes = useRef<Array<Array<Node>>>([]);
  const [lastLocation, setLastLocation] = useState<Location>({ x: -1, y: -1 });
  const [pointerDown, setPointerDown] = useState<boolean>(false);

  const RECT_SIZE = 25;

  const getRowCount = (canvas: HTMLCanvasElement): number => {
    return canvas.width / RECT_SIZE;
  };

  const getColumnCount = (canvas: HTMLCanvasElement): number => {
    return canvas.height / RECT_SIZE;
  };

  const getNodeColor = (node: Node): Color => {
    switch (node) {
      case Node.Wall:
        return COLOR_WALL_MAIN;
      default:
        return COLOR_EMPTY_MAIN;
    }
  };

  const drawNode = (
    context: CanvasRenderingContext2D,
    location: Location,
    size: Size,
    color: Color
  ) => {
    const { x, y } = location;
    const { width, height } = size;
    const { r, g, b } = color;

    context.beginPath();
    context.fillStyle = `rgb(${r}, ${g}, ${b})`;
    context.rect(x, y, width, height);
    context.fill();
    context.stroke();
    context.closePath();
  };

  const animateNode = (
    context: CanvasRenderingContext2D,
    location: Location,
    size: Size,
    startColor: Color,
    endColor: Color,
    type: Node
  ) => {
    const { x, y } = location;

    const steps = 50;

    const dr = (startColor.r - endColor.r) / steps;
    const dg = (startColor.g - endColor.g) / steps;
    const db = (startColor.b - endColor.b) / steps;

    let step = 0;

    const animation = setInterval(() => {
      const color = {
        r: Math.round(startColor.r - dr * step),
        g: Math.round(startColor.g - dg * step),
        b: Math.round(startColor.b - db * step),
      };
      console.log(color);
      drawNode(context, location, size, color);

      const node = nodes.current[x / RECT_SIZE][y / RECT_SIZE];

      if (step === steps || node !== type) {
        clearInterval(animation);
        drawNode(context, location, size, getNodeColor(node));
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
        const location = { x: i * RECT_SIZE, y: j * RECT_SIZE };
        const size = { width: RECT_SIZE, height: RECT_SIZE };
        const color = getNodeColor(nodes.current[i][j]);

        drawNode(context, location, size, color);
      }
    }
  };

  const setNode = (e: MouseEvent, location: Location) => {
    const { x, y } = location;

    const node = nodes.current[x][y];

    if (node === Node.Start || node === Node.End) {
      return;
    }

    const canvas = e.target as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const type = node === Node.Wall ? Node.Empty : Node.Wall;

    nodes.current = nodes.current.map((row, index) => {
      if (index === x) {
        row[y] = type;
        return row;
      } else {
        return row;
      }
    });

    const size = { width: RECT_SIZE, height: RECT_SIZE };
    const color = getNodeColor(type);

    if (type === Node.Wall) {
      animateNode(
        context,
        { x: x * RECT_SIZE, y: y * RECT_SIZE },
        size,
        COLOR_WALL_ALT,
        color,
        type
      );
    } else {
      drawNode(context, { x: x * RECT_SIZE, y: y * RECT_SIZE }, size, color);
    }
  };

  const getLocation = (e: MouseEvent): Location => {
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
    const location = getLocation(e);
    const { x, y } = location;

    if (x === lastLocation.x && y === lastLocation.y) {
      return;
    }

    setLastLocation(location);

    if (!pointerDown) {
      return;
    }

    setNode(e, location);
  };

  const handleMouseDown = (e: MouseEvent) => {
    const location = getLocation(e);

    setNode(e, location);
    setPointerDown(true);
  };

  const handleMouseUp = (_: MouseEvent) => {
    setPointerDown(false);
  };

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
}

export default Canvas;
