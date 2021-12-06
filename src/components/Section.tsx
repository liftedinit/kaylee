import "./Section.css";

interface SectionProps {
  children?: React.ReactNode;
  title?: string;
}

function Section({ children, title }: SectionProps) {
  return (
    <div className={`${title} Section`}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default Section;
