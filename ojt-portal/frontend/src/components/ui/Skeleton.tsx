interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = "bg-gray-200/80 dark:bg-gray-700/50 cursor-wait";
  
  const variantClasses = {
    text: "rounded-md h-4 w-full my-1",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
    none: ""
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`} 
      style={style}
    />
  );
}