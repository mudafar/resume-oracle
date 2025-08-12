interface IconProps {
  size?: number;
  className?: string;
}

export const AppIcon = ({ size = 64, className }: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    width={size} 
    height={size}
    className={className}
    role="img"
  >
    <title id="sm1t">Resume Oracle — Page Smile with Spark</title>
    <desc id="sm1d">Document with last line curved into a smile and a spark icon nearby.</desc>

 <g>
  <title>Layer 1</title>
  <rect id="svg_1" fill="#1B3A57" rx="8" height="32" width="32"/>
  <rect id="svg_2" fill="#1B3A57" rx="4" height="24" width="24" y="4" x="4"/>
  <rect id="svg_3" fill="#F8FAFC" rx="1" height="3" width="16" y="5.15103" x="8"/>
  <rect id="svg_4" fill="#F8FAFC" rx="1" height="3" width="12" y="11.23461" x="8"/>
  <path id="svg_5" strokeLinecap="round" strokeWidth="4" stroke="#FFD700" fill="none" d="m8,19.5c4,3.5 12,3.5 16,0"/>
 </g>
  </svg>
);