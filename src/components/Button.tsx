import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyle = "relative flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-lg overflow-hidden uppercase tracking-wide";
  
  const variants = {
    primary: "btn-3d-primary glow-yellow",
    secondary: "bg-[#111] text-white border-2 border-[#222] border-b-[6px] active:border-b-2 active:translate-y-[4px] transition-all"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
