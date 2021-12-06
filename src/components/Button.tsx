interface ButtonProps {
  label: string;
  onClick?: React.MouseEventHandler;
  isActive?: boolean;
}

function Button({ isActive, label, onClick }: ButtonProps) {
  return (
    <button className={`Button ${isActive ? " active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
