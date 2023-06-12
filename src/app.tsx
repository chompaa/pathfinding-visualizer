import "./app.css";

import Canvas from "./components/Canvas";
import { dijkstra } from "./algorithms/dijkstra";

export function App() {
  return (
    <div class="container">
      <Canvas algorithm={dijkstra}></Canvas>
    </div>
  );
}
