import React, { Children } from "react";
import "./Columns.css";

interface ColumnsProps {
  children?: React.ReactNode;
}

function Columns({ children }: ColumnsProps) {
  return (
    <div className="Columns">
      {Children.map(children, (child: React.ReactNode) => (
        <div className="Column">{child}</div>
      ))}
    </div>
  );
}

export default Columns;
