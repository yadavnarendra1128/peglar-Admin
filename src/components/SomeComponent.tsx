import React, { useState } from "react";
// import CustomCursor from "./CustomCursor"; // Adjust path

const SomeComponent: React.FC = () => {
  // State to track if the cursor is hovered
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}  // Set hovered state to true on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Set hovered state to false on mouse leave
    >
      <h1>Hover over me!</h1>
      <p>Custom cursor will appear when hovering over this area.</p>
      
      {/* Include the CustomCursor component */}
      {/* <CustomCursor isHovered={isHovered} /> */}
    </div>
  );
};

export default SomeComponent;
