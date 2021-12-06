import React, { Children } from "react";
import "./ButtonGroup.css";

interface ButtonGroupProps {
  children?: React.ReactNode;
  setTab?: (tab: number) => void;
  tab?: number;
}

function ButtonGroup({ children, setTab, tab }: ButtonGroupProps) {
  const [active, setActive] = React.useState(tab);
  return (
    <div className="ButtonGroup">
      {Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              onClick: (e: React.MouseEvent) => {
                setActive(index);
                setTab && setTab(index);
                child.props.onClick && child.props.onClick(e);
              },
              isActive: active === index,
            })
          : ""
      )}
    </div>
  );
}

export default ButtonGroup;
