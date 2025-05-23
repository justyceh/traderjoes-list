import { useRef, useState } from 'react';

const GlowCard = ({ children, classname }) => {
  const cardRef = useRef(null);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGradientPos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative rounded p-4 transition duration-200 bg-white shadow ${classname}`}
      style={{
        border: hovered ? '2px solid transparent' : 'none',
        borderImage: hovered
          ? `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgb(244 63 94), transparent 60%) 1`
          : 'none'
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowCard;
