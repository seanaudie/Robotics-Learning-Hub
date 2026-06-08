import React from "react";

export default function RoboticArmIcon({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Heavy base foundation of the robot */}
      <path d="M 3 21 L 21 21" />
      <path d="M 6 21 L 8 16 L 16 16 L 18 21" id="robot-base-shaping" />

      {/* Shoulder Joint Pivot */}
      <circle cx="12" cy="16" r="2.5" fill="currentColor" fillOpacity="0.2" />

      {/* Primary Robotic Link (Upper Arm) */}
      <path d="M 12 13.5 L 8 7" />

      {/* Elbow Joint Pivot */}
      <circle cx="8" cy="7" r="2" fill="currentColor" fillOpacity="0.2" />

      {/* Secondary Robotic Link (Forearm) */}
      <path d="M 8 7 L 15 4" />

      {/* Wrist / Tooling Mount */}
      <circle cx="15" cy="4" r="1.2" fill="currentColor" />

      {/* End-effector Gripper Claws */}
      {/* Upper finger */}
      <path d="M 15.5 2 L 18.5 2 M 18.5 2 L 19.5 4" />
      {/* Lower finger */}
      <path d="M 15.5 6 L 18.5 6 M 18.5 6 L 19.5 4" />
    </svg>
  );
}
