import React, { Children } from "react";

interface TabsProps {
  children?: React.ReactNode;
  tab: number;
}

function Tabs({ tab = 0, children }: TabsProps) {
  return (
    <div className="Tabs">
      {Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              isActive: tab === index,
            })
          : ""
      )}
    </div>
  );
}

export default Tabs;
