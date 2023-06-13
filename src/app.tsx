import "./app.css";

import { useEffect, useState } from "preact/hooks";
import { PathfindingAlgorithmObject } from "./algorithms";
import Canvas from "./components/canvas";
import Menu from "./components/menu";

export function App() {
  const [pathfindingAlgorithm, setPathfindingAlgorithm] = useState<
    PathfindingAlgorithmObject | undefined
  >(undefined);

  useEffect(() => {
    console.log(pathfindingAlgorithm);
  }, [pathfindingAlgorithm]);

  return (
    <div class="container">
      <Menu setAlgorithm={setPathfindingAlgorithm}></Menu>
      <Canvas algorithm={pathfindingAlgorithm?.algorithm}></Canvas>
    </div>
  );
}
