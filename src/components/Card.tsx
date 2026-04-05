import React from 'react';

export const Card = ({ children, className = '', ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`card-gradient border-glow p-6 rounded-[2rem] shadow-lg ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
