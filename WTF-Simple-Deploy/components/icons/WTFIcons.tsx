import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

export const VotingIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="wtfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
      stroke="url(#wtfGradient)"
      strokeWidth="2"
      fill="url(#wtfGradient)"
      fillOpacity="0.1"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="url(#wtfGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const PresaleIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <circle
      cx="12"
      cy="8"
      r="6"
      stroke="url(#coinGradient)"
      strokeWidth="2"
      fill="url(#coinGradient)"
      fillOpacity="0.15"
    />
    <circle
      cx="12"
      cy="12"
      r="6"
      stroke="url(#coinGradient)"
      strokeWidth="2"
      fill="url(#coinGradient)"
      fillOpacity="0.1"
    />
    <circle
      cx="12"
      cy="16"
      r="6"
      stroke="url(#coinGradient)"
      strokeWidth="2"
      fill="url(#coinGradient)"
      fillOpacity="0.05"
    />
    <text x="12" y="13" textAnchor="middle" fill="url(#coinGradient)" fontSize="8" fontWeight="bold">$</text>
  </svg>
)

export const BuilderIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="builderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"
      stroke="url(#builderGradient)"
      strokeWidth="2"
      fill="url(#builderGradient)"
      fillOpacity="0.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)


export const StarIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      stroke="url(#starGradient)"
      strokeWidth="2"
      fill="url(#starGradient)"
      fillOpacity="0.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const RocketIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
      stroke="url(#rocketGradient)"
      strokeWidth="2"
      fill="url(#rocketGradient)"
      fillOpacity="0.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
      stroke="url(#rocketGradient)"
      strokeWidth="2"
      fill="url(#rocketGradient)"
      fillOpacity="0.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
      stroke="url(#rocketGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
      stroke="url(#rocketGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const UsersIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="usersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke="url(#usersGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="9"
      cy="7"
      r="4"
      stroke="url(#usersGradient)"
      strokeWidth="2"
      fill="url(#usersGradient)"
      fillOpacity="0.1"
    />
    <path
      d="M22 21v-2a4 4 0 0 0-3-3.87"
      stroke="url(#usersGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 3.13a4 4 0 0 1 0 7.75"
      stroke="url(#usersGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const FireIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      stroke="url(#fireGradient)"
      strokeWidth="2"
      fill="url(#fireGradient)"
      fillOpacity="0.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const InfoIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="infoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="url(#infoGradient)"
      strokeWidth="2"
      fill="url(#infoGradient)"
      fillOpacity="0.1"
    />
    <path
      d="M12 16v-4"
      stroke="url(#infoGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8h.01"
      stroke="url(#infoGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const ClockIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="url(#clockGradient)"
      strokeWidth="2"
      fill="url(#clockGradient)"
      fillOpacity="0.1"
    />
    <polyline
      points="12,6 12,12 16,14"
      stroke="url(#clockGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const WarningIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke="url(#warningGradient)"
      strokeWidth="2"
      fill="url(#warningGradient)"
      fillOpacity="0.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="9"
      x2="12"
      y2="13"
      stroke="url(#warningGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17h.01"
      stroke="url(#warningGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const CoinsIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="coinsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="url(#coinsGradient)"
      strokeWidth="2"
      fill="url(#coinsGradient)"
      fillOpacity="0.1"
    />
    <path
      d="M16 8v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8"
      stroke="url(#coinsGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="16"
      cy="16"
      r="6"
      stroke="url(#coinsGradient)"
      strokeWidth="2"
      fill="url(#coinsGradient)"
      fillOpacity="0.15"
    />
  </svg>
)

export const XPIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      stroke="url(#xpGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="url(#xpGradient)"
      fillOpacity="0.15"
    />
  </svg>
)

export const TrophyIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"
      stroke="url(#trophyGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
      stroke="url(#trophyGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 20H6"
      stroke="url(#trophyGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16v4"
      stroke="url(#trophyGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 4h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
      stroke="url(#trophyGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="url(#trophyGradient)"
      fillOpacity="0.1"
    />
  </svg>
)

export const CoinStackIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="coinStackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <ellipse
      cx="12"
      cy="7"
      rx="9"
      ry="3"
      stroke="url(#coinStackGradient)"
      strokeWidth="2"
      fill="url(#coinStackGradient)"
      fillOpacity="0.1"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="9"
      ry="3"
      stroke="url(#coinStackGradient)"
      strokeWidth="2"
      fill="url(#coinStackGradient)"
      fillOpacity="0.15"
    />
    <ellipse
      cx="12"
      cy="17"
      rx="9"
      ry="3"
      stroke="url(#coinStackGradient)"
      strokeWidth="2"
      fill="url(#coinStackGradient)"
      fillOpacity="0.2"
    />
    <path
      d="M3 7v10c0 1.657 4.03 3 9 3s9-1.343 9-3V7"
      stroke="url(#coinStackGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const CalendarStackIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="calendarStackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="url(#calendarStackGradient)"
      strokeWidth="2"
      fill="url(#calendarStackGradient)"
      fillOpacity="0.1"
    />
    <line
      x1="16"
      y1="2"
      x2="16"
      y2="6"
      stroke="url(#calendarStackGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="2"
      x2="8"
      y2="6"
      stroke="url(#calendarStackGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="3"
      y1="10"
      x2="21"
      y2="10"
      stroke="url(#calendarStackGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="8"
      cy="14"
      r="1"
      fill="url(#calendarStackGradient)"
    />
    <circle
      cx="12"
      cy="14"
      r="1"
      fill="url(#calendarStackGradient)"
    />
    <circle
      cx="16"
      cy="14"
      r="1"
      fill="url(#calendarStackGradient)"
    />
    <circle
      cx="8"
      cy="18"
      r="1"
      fill="url(#calendarStackGradient)"
    />
  </svg>
)

export const ShieldIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke="url(#shieldGradient)"
      strokeWidth="2"
      fill="url(#shieldGradient)"
      fillOpacity="0.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="url(#shieldGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const EthIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="ethGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L5.5 12.5l6.5 3.5 6.5-3.5L12 2z"
      stroke="url(#ethGradient)"
      strokeWidth="2"
      fill="url(#ethGradient)"
      fillOpacity="0.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 12.5L12 22l6.5-9.5"
      stroke="url(#ethGradient)"
      strokeWidth="2"
      fill="url(#ethGradient)"
      fillOpacity="0.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const ChartIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <polyline
      points="3,17 9,11 13,15 21,7"
      stroke="url(#chartGradient)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="14,7 21,7 21,14"
      stroke="url(#chartGradient)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="3"
      cy="17"
      r="2"
      fill="url(#chartGradient)"
    />
    <circle
      cx="9"
      cy="11"
      r="2"
      fill="url(#chartGradient)"
    />
    <circle
      cx="13"
      cy="15"
      r="2"
      fill="url(#chartGradient)"
    />
    <circle
      cx="21"
      cy="7"
      r="2"
      fill="url(#chartGradient)"
    />
  </svg>
)

export const NetworkIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE500" />
        <stop offset="50%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="url(#networkGradient)"
      strokeWidth="2"
      fill="url(#networkGradient)"
      fillOpacity="0.1"
    />
    <circle
      cx="6"
      cy="6"
      r="2"
      stroke="url(#networkGradient)"
      strokeWidth="2"
      fill="url(#networkGradient)"
      fillOpacity="0.15"
    />
    <circle
      cx="18"
      cy="6"
      r="2"
      stroke="url(#networkGradient)"
      strokeWidth="2"
      fill="url(#networkGradient)"
      fillOpacity="0.15"
    />
    <circle
      cx="6"
      cy="18"
      r="2"
      stroke="url(#networkGradient)"
      strokeWidth="2"
      fill="url(#networkGradient)"
      fillOpacity="0.15"
    />
    <circle
      cx="18"
      cy="18"
      r="2"
      stroke="url(#networkGradient)"
      strokeWidth="2"
      fill="url(#networkGradient)"
      fillOpacity="0.15"
    />
    <line
      x1="8"
      y1="8"
      x2="10"
      y2="10"
      stroke="url(#networkGradient)"
      strokeWidth="2"
    />
    <line
      x1="16"
      y1="8"
      x2="14"
      y2="10"
      stroke="url(#networkGradient)"
      strokeWidth="2"
    />
    <line
      x1="8"
      y1="16"
      x2="10"
      y2="14"
      stroke="url(#networkGradient)"
      strokeWidth="2"
    />
    <line
      x1="16"
      y1="16"
      x2="14"
      y2="14"
      stroke="url(#networkGradient)"
      strokeWidth="2"
    />
  </svg>
)