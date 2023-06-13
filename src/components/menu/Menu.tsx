import MenuItem from "./MenuItem";

import { useState } from "preact/hooks";

import { IconBulb, IconRouteOff, IconWallOff } from "@tabler/icons-preact";
import {
  PathfindingAlgorithmList,
  PathfindingAlgorithmObject,
  PathfindingAlgorithms,
} from "../../algorithms";
import MenuSeparator from "./MenuSeparator";

import { Node } from "../canvas";

const Menu = ({
  solvePath,
  removeNodes,
}: {
  solvePath: Function;
  removeNodes: Function;
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<PathfindingAlgorithmObject>(PathfindingAlgorithms.dijkstra);

  const handlePathfindingAlgorithmChange = (e: any) => {
    const algorithm: string = e.target.value;

    if (!algorithm) {
      return;
    }

    setSelectedAlgorithm(
      (PathfindingAlgorithms as PathfindingAlgorithmList)[algorithm]
    );
  };

  const clearWalls = () => {
    removeNodes([Node.Wall]);
  };

  const clearPath = () => {
    removeNodes([Node.Explore, Node.Path]);
  };

  const pathfind = () => {
    if (!selectedAlgorithm) {
      return;
    }

    clearPath();
    solvePath(selectedAlgorithm.algorithm);
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
            defaultValue={selectedAlgorithm.title}
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
      </div>
    </div>
  );
};

export default Menu;
