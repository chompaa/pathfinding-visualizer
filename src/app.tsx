import "./app.css";

import { useState } from "preact/hooks";
import { PathfindingAlgorithm, PathfindingAlgorithmType } from "./algorithms";
import { dijkstra } from "./algorithms/dijkstra";
import Canvas from "./components/canvas";
import Menu from "./components/menu";

export function App() {
  const [pathfindingAlgorithm, setPathfindingAlgorithm] = useState<
    PathfindingAlgorithmType | undefined
  >(undefined);

  const getAlgorithm = (
    type: PathfindingAlgorithmType | undefined
  ): PathfindingAlgorithm | undefined => {
    switch (type) {
      case PathfindingAlgorithmType.Dijkstra:
        return dijkstra;
      default:
        return undefined;
    }
  };

  return (
    <div class="container">
      <Menu setAlgorithm={setPathfindingAlgorithm}></Menu>
      <Canvas algorithm={getAlgorithm(pathfindingAlgorithm)}></Canvas>
    </div>
  );
}
