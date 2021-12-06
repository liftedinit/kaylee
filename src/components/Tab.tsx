import "./Tab.css";

interface TabProps {
  children?: React.ReactNode;
  isActive?: boolean;
}

function Tab({ children, isActive }: TabProps) {
  return <div className={`Tab ${isActive ? " active" : ""}`}>{children}</div>;
}

export default Tab;
