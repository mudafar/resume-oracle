interface IconProps {
  size?: number;
  className?: string;
}

export const ResumeOracleIcon = ({ size = 128, className }: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 128 128" 
    width={size} 
    height={size}
    className={className}
    role="img"
  >
    <title id="sm1t">Resume Oracle — Page Smile with Spark</title>
    <desc id="sm1d">Document with last line curved into a smile and a spark icon nearby.</desc>
    {/*  Page */}
    <rect x="16" y="20.3" width="71.5" height="87.5" rx="8.5" fill="none" stroke="#1B3A57" strokeWidth="7.5" strokeLinejoin="round"/>
    {/* header */}
    <rect x="32" y="38.4" width="39.5" height="5.9" rx="3.2" fill="#1B3A57"/>
    {/* middle */}
    <rect x="32" y="54.4" width="29.9" height="5.9" rx="3.2" fill="#1B3A57"/>
    {/* smile line (curved) */}
    <path d="M32 73.6 C43.7 83.2, 58.7 83.2, 69.3 73.6" fill="none" stroke="#F4C542" strokeWidth="8.5" strokeLinecap="round"/>
    {/* spark */}
    <g transform="translate(75.7, 65.1) rotate(35)">
        <path d="M0 -6.4 L1.6 -1.6 L6.4 0 L1.6 1.6 L0 6.4 L-1.6 1.6 L-6.4 0 L-1.6 -1.6 Z" fill="#F4C542"/>
        <path d="M0 -3.2 L0.8 -0.8 L3.2 0 L0.8 0.8 L0 3.2 L-0.8 0.8 L-3.2 0 L-0.8 -0.8 Z" fill="#FFE066"/>
    </g>
  </svg>
);