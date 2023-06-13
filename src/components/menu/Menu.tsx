import MenuItem from "./MenuItem";

import { useState } from "preact/hooks";

import { IconRefresh, IconRoute } from "@tabler/icons-preact";
import {
  PathfindingAlgorithmList,
  PathfindingAlgorithmObject,
  PathfindingAlgorithms,
} from "../../algorithms";
import MenuSeparator from "./MenuSeparator";

const Menu = ({ setAlgorithm }: { setAlgorithm: Function }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    PathfindingAlgorithmObject | undefined
  >(undefined);

  const handlePathfindingAlgorithmChange = (e: any) => {
    const algorithm: string = e.target.value;

    if (!algorithm) {
      return;
    }

    setSelectedAlgorithm(
      (PathfindingAlgorithms as PathfindingAlgorithmList)[algorithm]
    );
  };

  return (
    <div class="menu-island">
      <MenuItem
        title={"Clear grid"}
        icon={<IconRefresh />}
        onClick={() => {}}
      ></MenuItem>
      <MenuSeparator></MenuSeparator>
      <select
        defaultValue={undefined}
        onChange={handlePathfindingAlgorithmChange}
      >
        <option>Select algorithm</option>
        {Object.entries(PathfindingAlgorithms).map(([key, value]) => (
          <option value={key}>{value.title}</option>
        ))}
      </select>
      <MenuItem
        title={"Solve"}
        icon={<IconRoute />}
        onClick={() => setAlgorithm(selectedAlgorithm)}
      ></MenuItem>
    </div>
  );
};

export default Menu;
