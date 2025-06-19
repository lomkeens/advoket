import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
    animationDuration: '1.5s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Dashboard specific skeleton components
export const DashboardCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <SkeletonLoader variant="text" width="80px" />
        <SkeletonLoader variant="text" width="60px" height="2rem" />
      </div>
      <SkeletonLoader variant="circular" width="48px" height="48px" />
    </div>
    <div className="mt-4">
      <SkeletonLoader variant="text" width="120px" />
    </div>
  </div>
);

export const CaseListSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b">
      <SkeletonLoader variant="text" width="150px" />
    </div>
    <div className="divide-y">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center space-x-2">
                <SkeletonLoader variant="rectangular" width="80px" height="24px" />
                <SkeletonLoader variant="rectangular" width="60px" height="24px" />
              </div>
              <SkeletonLoader variant="text" width="200px" />
              <SkeletonLoader variant="text" width="150px" />
            </div>
            <div className="space-y-2">
              <SkeletonLoader variant="text" width="100px" />
              <SkeletonLoader variant="text" width="80px" />
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <SkeletonLoader variant="rectangular" width="80px" height="28px" />
            <SkeletonLoader variant="rectangular" width="80px" height="28px" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonLoader;