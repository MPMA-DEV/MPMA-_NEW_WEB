import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 z-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[100px] animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-6 animate-fade-in p-6">
        <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white p-5 rounded-full shadow-xl shadow-blue-100 border border-white ring-1 ring-blue-50">
                <LoadingSpinner size="xl" className="text-blue-600" />
            </div>
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-gray-900 font-bold text-xl tracking-tight">OJT Portal</h3>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}