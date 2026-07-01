import LoadingSpinner from './LoadingSpinner';

interface ContainerLoaderProps {
  className?: string;
  message?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
}

export default function ContainerLoader({ 
  className = '', 
  message = 'Updating...', 
  spinnerSize = 'md' 
}: ContainerLoaderProps) {
  return (
    <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] transition-all duration-300 rounded-inherit ${className}`}>
      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center animate-fade-in">
        <LoadingSpinner size={spinnerSize} className="text-blue-600 mb-2" />
        {message && (
          <p className="text-sm font-medium text-gray-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}