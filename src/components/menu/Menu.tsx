import MenuItem from "./MenuItem";

import { useState } from "preact/hooks";

import {
  IconBulb,
  IconRouteOff,
  IconSettings,
  IconWallOff,
} from "@tabler/icons-preact";
import {
  AlgorithmList,
  AlgorithmObject,
  MazeAlgorithms,
  PathfindingAlgorithms,
} from "../../algorithms";
import MenuSeparator from "./MenuSeparator";

import { Node } from "../../types";

const Menu = ({
  solvePath,
  generateMaze,
  removeNodes,
}: {
  solvePath: Function;
  generateMaze: Function;
  removeNodes: Function;
}) => {
  const [pathfindingAlgorithm, setPathfindingAlgorithm] =
    useState<AlgorithmObject>(PathfindingAlgorithms.dijkstra);

  const [mazeAlgorithm, setMazeAlgorithm] = useState<AlgorithmObject>(
    MazeAlgorithms.recursive_divide
  );

  const handlePathfindingAlgorithmChange = (e: any) => {
    const algorithm: string = e.target.value;

    if (!algorithm) {
      return;
    }

    setPathfindingAlgorithm(
      (PathfindingAlgorithms as AlgorithmList)[algorithm]
    );
  };

  const handleMazeAlgorithmChange = (e: any) => {
    const algorithm: string = e.target.value;

    if (!algorithm) {
      return;
    }

    setMazeAlgorithm((MazeAlgorithms as AlgorithmList)[algorithm]);
  };

  const clearWalls = () => {
    removeNodes([Node.Wall]);
  };

  const clearPath = () => {
    removeNodes([Node.Explore, Node.Path]);
  };

  const pathfind = () => {
    if (!pathfindingAlgorithm) {
      return;
    }

    clearPath();
    solvePath(pathfindingAlgorithm.algorithm);
  };

  const generate = () => {
    if (!mazeAlgorithm) {
      return;
    }

    clearPath();
    clearWalls();
    generateMaze(mazeAlgorithm.algorithm);
  };

  return (
    <div class="menu-island">
      <div class="menu-section">
        <MenuItem
          title={"Clear walls"}
          icon={<IconWallOff />}
          onClick={() => clearWalls()}
        ></MenuItem>
        <MenuItem
          title={"Clear path"}
          icon={<IconRouteOff />}
          onClick={() => clearPath()}
        ></MenuItem>
      </div>
      <MenuSeparator></MenuSeparator>
      <div class="menu-section">
        <div class="menu-select">
          <select
            defaultValue={pathfindingAlgorithm.title}
            onChange={handlePathfindingAlgorithmChange}
          >
            {Object.entries(PathfindingAlgorithms).map(([key, value]) => (
              <option value={key}>{value.title}</option>
            ))}
          </select>
          <MenuItem
            title={"Solve"}
            icon={<IconBulb />}
            onClick={() => pathfind()}
          ></MenuItem>
        </div>
        <div class="menu-select">
          <select
            defaultValue={mazeAlgorithm.title}
            onChange={handleMazeAlgorithmChange}
          >
            {Object.entries(MazeAlgorithms).map(([key, value]) => (
              <option value={key}>{value.title}</option>
            ))}
          </select>
          <MenuItem
            title={"Generate"}
            icon={<IconSettings />}
            onClick={() => generate()}
          ></MenuItem>
        </div>
      </div>
    </div>
  );
};

export default Menu;
