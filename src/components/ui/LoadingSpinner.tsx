import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'primary', 
  text,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const variantClasses = {
    primary: 'text-indigo-600',
    secondary: 'text-gray-600',
    white: 'text-white'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Modern spinner with multiple dots */}
      <div className="relative">
        <div className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`}>
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
              className="animate-pulse"
              style={{
                animation: 'spin 2s linear infinite, dash 1.5s ease-in-out infinite'
              }}
            />
          </svg>
        </div>
        
        {/* Pulsing dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className={`w-1 h-1 ${variantClasses[variant]} rounded-full animate-pulse`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-1 h-1 ${variantClasses[variant]} rounded-full animate-pulse`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-1 h-1 ${variantClasses[variant]} rounded-full animate-pulse`} style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
      
      {text && (
        <div className={`${textSizeClasses[size]} ${variantClasses[variant]} font-medium animate-pulse`}>
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Add custom CSS for the dash animation
const style = document.createElement('style');
style.textContent = `
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;
document.head.appendChild(style);

export default LoadingSpinner;