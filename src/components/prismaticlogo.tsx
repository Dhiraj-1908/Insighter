import React, { useState } from "react";

const InsighterLogo = ({ className = "" }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex items-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 200"
        className="w-full h-full"
      >
        <defs>
          {/* Enhanced glow effect */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={hovered ? "4" : "2"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Elegant hexagon gradient */}
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="25%" stopColor="#9B59B6" />
            <stop offset="50%" stopColor="#E74C3C" />
            <stop offset="75%" stopColor="#F39C12" />
            <stop offset="100%" stopColor="#2ECC71" />
            <animate
              attributeName="x1"
              values="0%;20%;0%"
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y1"
              values="0%;20%;0%"
              dur="6s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Subtle text shadow */}
          <filter id="textShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.2" />
          </filter>

          {/* Text animation mask */}
          <mask id="textMask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect x="0" y="0" width="10" height="100">
              <animate
                attributeName="x"
                from="-100"
                to="800"
                dur="3s"
                begin="0s"
                repeatCount="indefinite"
              />
            </rect>
          </mask>

          {/* Animated underline gradient */}
          <linearGradient
            id="underlineGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="50%" stopColor="#9B59B6" />
            <stop offset="100%" stopColor="#E74C3C" />
            <animate
              attributeName="x1"
              values="0%;100%;0%"
              dur="8s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        <g transform="translate(50, 100)">
          {/* Hexagon container with subtle shadow */}
          <g transform="translate(0, -50)" filter="url(#softGlow)">
            {/* Elegant container base with pulsing animation - Changed to yellow */}
            <rect
              width="100"
              height="100"
              fill="#3d3d38"
              rx="12"
              ry="12"
              stroke="#FFC107"
              strokeWidth="1"
            >
              <animate
                attributeName="stroke-width"
                values="1;2;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Main hexagon shape with elegant gradient and enhanced animation */}
            <path
              d="M50,15 L80,32 L80,68 L50,85 L20,68 L20,32 Z"
              fill="url(#hexGradient)"
            >
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M50,15 L80,32 L80,68 L50,85 L20,68 L20,32 Z;
                  M50,18 L83,35 L83,65 L50,82 L17,65 L17,35 Z;
                  M50,15 L80,32 L80,68 L50,85 L20,68 L20,32 Z"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="17s"
                repeatCount="indefinite"
                additive="sum"
              />
            </path>

            {/* Top face with light reflection and animation - Adjusted for yellow background */}
            <path
              d="M50,15 L80,32 L50,50 L20,32 Z"
              fill="#FFF9C4"
              fillOpacity="0.5"
            >
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M50,15 L80,32 L50,50 L20,32 Z;
                  M50,18 L83,35 L50,53 L17,35 Z;
                  M50,15 L80,32 L50,50 L20,32 Z"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
              <animate
                attributeName="fill-opacity"
                values="0.5;0.7;0.5"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>

            {/* Bottom face with subtle shadow and animation */}
            <path d="M50,50 L80,68 L50,85 L20,68 Z" fill="rgba(0,0,0,0.1)">
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M50,50 L80,68 L50,85 L20,68 Z;
                  M50,53 L83,65 L50,82 L17,65 Z;
                  M50,50 L80,68 L50,85 L20,68 Z"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
            </path>
          </g>

          {/* Animated brand name with stylish font */}
          <g transform="translate(120, 20)" filter="url(#textShadow)">
            {/* Main title with bold stylish text - Changed font family */}
            <g>
              <text
                fontFamily="'Montserrat', 'Trebuchet MS', sans-serif"
                fontSize="68"
                fontWeight="900"
                letterSpacing="0"
                fill="black"
              >
                <tspan>Insighter.ai</tspan>
                <animate
                  attributeName="opacity"
                  values="1;0.8;1"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </text>

              {/* Animated text overlay effect */}
              <text
                fontFamily="'Montserrat', 'Trebuchet MS', sans-serif"
                fontSize="68"
                fontWeight="900"
                letterSpacing="0"
                fill="#333"
                opacity="0.1"
                mask="url(#textMask)"
              >
                <tspan>Insighter</tspan>
                <animate
                  attributeName="opacity"
                  values="0.1;0.3;0.1"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </text>
            </g>

            {/* UPDATED: Two separate underlines instead of one single line */}
            <g transform="translate(4, 10)">
              {/* First underline (left side) */}
              <path
                d="M0,1 L100,1"
                stroke="#2838eb"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
                strokeOpacity="0.9"
              >
                <animate
                  attributeName="stroke-width"
                  values="9;7;9"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Second underline (right side) - starts after the 'g' */}
              <path
                d="M145,1 L350,1"
                stroke="#2838eb"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
                strokeOpacity="0.9"
              >
                <animate
                  attributeName="stroke-width"
                  values="9;7;9"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Magnifying glass at the end of line */}
              <g transform="translate(360, -9) scale(0.7)">
                {/* Handle */}
                <path
                  d="M0,0 L15,15"
                  stroke="#333"
                  strokeWidth="4"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-width"
                    values="4;5;4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Glass circle */}
                <circle
                  cx="-10"
                  cy="-10"
                  r="12"
                  fill="none"
                  stroke="#333"
                  strokeWidth="4"
                >
                  <animate
                    attributeName="r"
                    values="12;13;12"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  {/* Reflection */}
                  <animate
                    attributeName="stroke"
                    values="#333;#666;#333"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Reflection highlight */}
                <path
                  d="M-18,-18 Q-14,-22 -10,-18"
                  stroke="#FFF"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-width"
                    values="2;3;2"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Subtle zoom animation */}
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="0.7;0.75;0.7"
                  dur="2s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default InsighterLogo;
