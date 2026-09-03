import { Loader } from "lucide-react";

interface LoadingProps {
  message: string;
}

export default function Loading({ message }: LoadingProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex min-w-[220px] flex-col items-center justify-center gap-4 rounded-2xl border border-lightgray bg-white px-8 py-6 shadow-2xl">
        
        {/* Soft background circle to frame the spinner */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
          <Loader 
            size={28} 
            strokeWidth={2.5} 
            className="animate-spin text-primary" 
          />
        </div>
        
        <p className="text-center text-sm font-semibold tracking-wide text-primary-dark">
          {message}
        </p>
        
      </div>
    </div>
  );
}