import { cloneElement } from "preact/compat";

import { JSX } from "preact";

const MenuItem = ({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: JSX.Element;
  onClick: Function;
}) => {
  return (
    <button
      class="menu-item-button"
      // promise resolution gets rid of click handler timing violation
      onClick={async () => {
        await Promise.resolve();
        onClick();
      }}
    >
      {cloneElement(icon, { size: 14 })}
      {title}
    </button>
  );
};

export default MenuItem;
