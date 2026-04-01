import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

// Legacy component kept for compatibility — now renders as a plain wrapper
export function MobileContainer({ children, className = "" }: MobileContainerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
}
