import React from 'react';

const PrismaticLogo = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" className="w-full h-full">
        <g transform="translate(50, 100)">
          <g transform="translate(0, -50)">
            <rect width="100" height="100" fill="#FFD700" rx="20"/>
            <path d="M50,15 L75,35 L65,85 L35,85 L25,35 Z" fill="#444">
              <animate 
                attributeName="d" 
                dur="3s"
                repeatCount="indefinite"
                values="
                  M50,15 L75,35 L65,85 L35,85 L25,35 Z;
                  M50,20 L80,40 L60,80 L40,80 L20,40 Z;
                  M50,15 L75,35 L65,85 L35,85 L25,35 Z"
              />
            </path>
            <path d="M50,15 L75,35 L50,55 L25,35 Z" fill="#666">
              <animate 
                attributeName="d" 
                dur="3s"
                repeatCount="indefinite"
                values="
                  M50,15 L75,35 L50,55 L25,35 Z;
                  M50,20 L80,40 L50,60 L20,40 Z;
                  M50,15 L75,35 L50,55 L25,35 Z"
              />
            </path>
            <path d="M50,55 L65,85 L35,85 Z" fill="#888">
              <animate 
                attributeName="d" 
                dur="3s"
                repeatCount="indefinite"
                values="
                  M50,55 L65,85 L35,85 Z;
                  M50,60 L60,80 L40,80 Z;
                  M50,55 L65,85 L35,85 Z"
              />
            </path>
          </g>
          <g transform="translate(120, 20)">
            <text fontFamily="Arial Black, sans-serif" fontSize="72" fill="black">
              <tspan>Prismatic</tspan>
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default PrismaticLogo;