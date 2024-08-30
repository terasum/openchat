import React from "react";
import "boxicons/css/boxicons.min.css";
// https://boxicons.com/usage
interface BoxIconProps {
  iconName: string;
  size?: number;
  color?: string;
  className?: string;
}
const BoxIcon: React.FC<BoxIconProps> = ({
  iconName,
  size = 24,
  color = "#000",
  className = "",
}) => {
  return (
    <i
      className={`bx bx-${iconName}`}
      style={{ width: size, height: size, color: color }}
    ></i>
  );
};

export { BoxIcon };
