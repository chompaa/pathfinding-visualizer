import MenuItem from "./MenuItem";

import { IconRefresh, IconRoute } from "@tabler/icons-preact";
import { PathfindingAlgorithmType } from "../../algorithms";

const Menu = ({ setAlgorithm }: { setAlgorithm: Function }) => {
  return (
    <div class="menu-island">
      <MenuItem
        title={"Clear grid"}
        icon={<IconRefresh />}
        onClick={() => {}}
      ></MenuItem>
      <MenuItem
        title={"Solve"}
        icon={<IconRoute />}
        onClick={() => setAlgorithm(PathfindingAlgorithmType.Dijkstra)}
      ></MenuItem>
    </div>
  );
};

export default Menu;
